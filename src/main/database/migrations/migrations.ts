import type { DbClient } from "../connection.ts";
import {
  getPasswordLookup,
  hashPassword,
  isPasswordHash,
} from "../../shared/passwordHash.ts";
import { createItemWithStatusView } from "../views/itemWithStatusView.ts";
import { createClientIdLookupIndex } from "../schema/client/clientIdTable.ts";
import { createClientPhoneLookupIndex } from "../schema/client/clientTable.ts";

type Migration = {
  id: string;
  run: (client: DbClient) => Promise<void>;
};

const hardeningMigration: Migration = {
  id: "2026-09-26-pre-production-hardening",
  run: async (client) => {
    await client.query("DROP VIEW IF EXISTS item_with_status");

    await client.query(`
      ALTER TABLE ticket
        ADD COLUMN IF NOT EXISTS client_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;

      ALTER TABLE ticket_item
        ADD COLUMN IF NOT EXISTS item_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;

      ALTER TABLE ticket
        ALTER COLUMN amount TYPE NUMERIC(12, 2),
        ALTER COLUMN onetime_fee TYPE NUMERIC(12, 2);

      ALTER TABLE item
        ALTER COLUMN amount TYPE NUMERIC(12, 2);

      ALTER TABLE xml_report_submission
        ADD COLUMN IF NOT EXISTS payload_hash TEXT NOT NULL DEFAULT '';

      ALTER TABLE xml_report_submission
        DROP CONSTRAINT IF EXISTS xml_report_submission_status_check;

      ALTER TABLE xml_report_submission
        ADD CONSTRAINT xml_report_submission_status_check
        CHECK (status IN ('submitting', 'submitted', 'failed'));

      CREATE INDEX IF NOT EXISTS idx_ticket_client_timeline
        ON ticket(client_number, transaction_datetime, ticket_number);
      CREATE INDEX IF NOT EXISTS idx_ticket_pawned_due_date_location
        ON ticket(due_date, location)
        WHERE status = 'pawned';
      CREATE INDEX IF NOT EXISTS idx_ticket_transaction_datetime
        ON ticket(transaction_datetime, ticket_number);
      CREATE INDEX IF NOT EXISTS idx_ticket_pickup_datetime
        ON ticket(pickup_datetime, ticket_number)
        WHERE pickup_datetime IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_ticket_status_updated_at
        ON ticket(status_updated_at, ticket_number);
      CREATE INDEX IF NOT EXISTS idx_client_name_search
        ON client(LOWER(last_name), LOWER(first_name), client_number);
      CREATE INDEX IF NOT EXISTS idx_client_date_of_birth
        ON client(date_of_birth, client_number);
      CREATE INDEX IF NOT EXISTS idx_client_id_normalized_value
        ON client_id(
          UPPER(TRIM(id_type)),
          UPPER(REGEXP_REPLACE(id_value, '[^A-Za-z0-9]', '', 'g'))
        );
      CREATE INDEX IF NOT EXISTS idx_client_id_client_number
        ON client_id(client_number, id);
      CREATE INDEX IF NOT EXISTS idx_item_brand_name_lower
        ON item(LOWER(brand_name));
      CREATE INDEX IF NOT EXISTS idx_item_model_number_lower
        ON item(LOWER(model_number));
      CREATE INDEX IF NOT EXISTS idx_item_serial_number_lower
        ON item(LOWER(serial_number));
      CREATE INDEX IF NOT EXISTS idx_xml_report_submission_identity
        ON xml_report_submission(
          environment,
          ticket_number,
          ticket_type,
          ticket_datetime
        );
    `);

    await client.query(createItemWithStatusView);

    await client.query(`
      WITH id_snapshots AS (
        SELECT
          ci.client_number,
          jsonb_agg(
            jsonb_build_object(
              'id_type', ci.id_type,
              'id_value', ci.id_value
            ) ORDER BY ci.id
          ) AS values
        FROM client_id ci
        GROUP BY ci.client_number
      ),
      client_snapshots AS (
        SELECT
          c.client_number,
          jsonb_build_object(
            'client_number', c.client_number,
            'first_name', c.first_name,
            'last_name', c.last_name,
            'middle_name', COALESCE(c.middle_name, ''),
            'date_of_birth', TO_CHAR(c.date_of_birth, 'YYYY-MM-DD'),
            'gender', c.gender,
            'hair_color', c.hair_color,
            'eye_color', c.eye_color,
            'height_cm', c.height_cm,
            'weight_kg', c.weight_kg,
            'address', COALESCE(c.address, ''),
            'city', COALESCE(c.city, ''),
            'province', COALESCE(c.province, ''),
            'postal_code', COALESCE(c.postal_code, ''),
            'phone', COALESCE(c.phone, ''),
            'email', COALESCE(c.email, ''),
            'image_path', COALESCE(c.image_path, ''),
            'identifications', COALESCE(ids.values, '[]'::jsonb)
          ) AS snapshot
        FROM client c
        LEFT JOIN id_snapshots ids ON ids.client_number = c.client_number
      )
      UPDATE ticket t
      SET client_snapshot = cs.snapshot
      FROM client_snapshots cs
      WHERE t.client_number = cs.client_number
        AND t.client_snapshot = '{}'::jsonb;
    `);

    await client.query(`
      UPDATE ticket_item ti
      SET item_snapshot = jsonb_build_object(
        'item_number', i.item_number,
        'quantity', i.quantity,
        'subcategory_id', i.subcategory_id,
        'category_name', COALESCE(ic.name, ''),
        'subcategory_name', COALESCE(isc.name, ''),
        'description', i.description,
        'brand_name', COALESCE(i.brand_name, ''),
        'model_number', COALESCE(i.model_number, ''),
        'serial_number', COALESCE(i.serial_number, ''),
        'amount', i.amount,
        'image_path', i.image_path
      )
      FROM item i
      LEFT JOIN item_subcategory isc ON isc.id = i.subcategory_id
      LEFT JOIN item_category ic ON ic.id = isc.category_id
      WHERE ti.item_number = i.item_number
        AND ti.item_snapshot = '{}'::jsonb;
    `);
  },
};

const xmlReportImageSnapshotMigration: Migration = {
  id: "2026-09-26-xml-report-image-snapshots",
  run: async (client) => {
    await client.query(`
      UPDATE ticket t
      SET client_snapshot = jsonb_set(
        t.client_snapshot,
        '{image_path}',
        to_jsonb(COALESCE(c.image_path, '')),
        TRUE
      )
      FROM client c
      WHERE c.client_number = t.client_number
        AND NOT (t.client_snapshot ? 'image_path')
    `);
  },
};

const employeePasswordMigration: Migration = {
  id: "2026-09-26-employee-password-hashes",
  run: async (client) => {
    await client.query(
      "ALTER TABLE employee ADD COLUMN IF NOT EXISTS password_lookup TEXT",
    );
    const result = await client.query<{
      employee_number: number;
      password: string;
    }>("SELECT employee_number, password FROM employee FOR UPDATE");

    for (const employee of result.rows) {
      const password = employee.password;

      if (isPasswordHash(password)) {
        const lookupResult = await client.query(
          "SELECT password_lookup FROM employee WHERE employee_number = $1",
          [employee.employee_number],
        );

        if (!lookupResult.rows[0]?.password_lookup) {
          throw new Error(
            `Employee #${employee.employee_number} has a password hash but no lookup value.`,
          );
        }
        continue;
      }

      await client.query(
        `
          UPDATE employee
          SET password = $1, password_lookup = $2
          WHERE employee_number = $3
        `,
        [
          await hashPassword(password),
          getPasswordLookup(password),
          employee.employee_number,
        ],
      );
    }

    await client.query(
      "ALTER TABLE employee ALTER COLUMN password_lookup SET NOT NULL",
    );
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS employee_password_lookup_key
      ON employee(password_lookup)
    `);
  },
};

const clientLookupIndexesMigration: Migration = {
  id: "2026-10-05-client-id-phone-search-indexes",
  run: async (client) => {
    await client.query(createClientIdLookupIndex);
    await client.query(createClientPhoneLookupIndex);
  },
};

const migrations: Migration[] = [
  hardeningMigration,
  employeePasswordMigration,
  xmlReportImageSnapshotMigration,
  clientLookupIndexesMigration,
];

export const runDatabaseMigrations = async (client: DbClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migration (
      id TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  for (const migration of migrations) {
    const existing = await client.query(
      "SELECT 1 FROM schema_migration WHERE id = $1",
      [migration.id],
    );

    if (existing.rowCount) {
      continue;
    }

    await migration.run(client);
    await client.query("INSERT INTO schema_migration (id) VALUES ($1)", [
      migration.id,
    ]);
  }
};
