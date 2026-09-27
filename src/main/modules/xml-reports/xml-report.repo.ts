import { connect } from "../../database/connection.ts";
import { runInTransaction } from "../../shared/runInTransaction.ts";
import type {
  XmlReportEnvironment,
  XmlReportSourceRow,
} from "./xml-report.types.ts";

export type XmlReportSubmissionRecord = {
  ticket_number: number;
  ticket_type: "Pawn" | "Buy";
  ticket_datetime: string;
  status: "submitting" | "submitted" | "failed";
  message: string;
  payload_hash: string;
};

export type XmlReportSubmissionIdentity = Pick<
  XmlReportSubmissionRecord,
  "ticket_number" | "ticket_type" | "ticket_datetime"
>;

export const getXmlSubmissionKey = (identity: XmlReportSubmissionIdentity) =>
  `${identity.ticket_number}\u0000${identity.ticket_type}\u0000${identity.ticket_datetime}`;

const text = (value: unknown) => (value == null ? "" : String(value));
const number = (value: unknown) => Number(value ?? 0);

const mapRow = (row: Record<string, unknown>): XmlReportSourceRow => ({
  ticket_number: number(row.ticket_number),
  transaction_datetime: new Date(text(row.transaction_datetime)),
  due_date: new Date(text(row.due_date)),
  ticket_amount: number(row.ticket_amount),
  ticket_status: text(row.ticket_status),
  employee_name: text(row.employee_name),
  client_number: number(row.client_number),
  first_name: text(row.first_name),
  last_name: text(row.last_name),
  middle_name: text(row.middle_name),
  date_of_birth: text(row.date_of_birth),
  gender: text(row.gender),
  hair_color: text(row.hair_color),
  eye_color: text(row.eye_color),
  height_cm: number(row.height_cm),
  weight_kg: number(row.weight_kg),
  address: text(row.address),
  city: text(row.city),
  province: text(row.province),
  postal_code: text(row.postal_code),
  phone: text(row.phone),
  email: text(row.email),
  id_type: text(row.id_type),
  id_value: text(row.id_value),
  id_type_2: text(row.id_type_2),
  id_value_2: text(row.id_value_2),
  client_image_path: text(row.client_image_path),
  item_number: row.item_number == null ? undefined : number(row.item_number),
  quantity: row.quantity == null ? undefined : number(row.quantity),
  category_name: text(row.category_name),
  description: text(row.description),
  brand_name: text(row.brand_name),
  model_number: text(row.model_number),
  serial_number: text(row.serial_number),
  item_amount: row.item_amount == null ? undefined : number(row.item_amount),
  item_image_path: text(row.item_image_path),
});

export const xmlReportRepo = {
  loadSourceRows: async (fromDate: string, toDate: string) => {
    const client = await connect();

    try {
      const result = await client.query(
        `
          SELECT
            t.ticket_number,
            t.transaction_datetime,
            t.due_date,
            t.amount AS ticket_amount,
            t.status AS ticket_status,
            t.employee_name,
            COALESCE((t.client_snapshot->>'client_number')::integer, c.client_number) AS client_number,
            COALESCE(t.client_snapshot->>'first_name', c.first_name, '') AS first_name,
            COALESCE(t.client_snapshot->>'last_name', c.last_name, '') AS last_name,
            COALESCE(t.client_snapshot->>'middle_name', c.middle_name, '') AS middle_name,
            COALESCE(t.client_snapshot->>'date_of_birth', TO_CHAR(c.date_of_birth, 'YYYY-MM-DD'), '') AS date_of_birth,
            COALESCE(t.client_snapshot->>'gender', c.gender, '') AS gender,
            COALESCE(t.client_snapshot->>'hair_color', c.hair_color, '') AS hair_color,
            COALESCE(t.client_snapshot->>'eye_color', c.eye_color, '') AS eye_color,
            COALESCE((t.client_snapshot->>'height_cm')::numeric, c.height_cm, 0) AS height_cm,
            COALESCE((t.client_snapshot->>'weight_kg')::numeric, c.weight_kg, 0) AS weight_kg,
            COALESCE(t.client_snapshot->>'address', c.address, '') AS address,
            COALESCE(t.client_snapshot->>'city', c.city, '') AS city,
            COALESCE(t.client_snapshot->>'province', c.province, '') AS province,
            COALESCE(t.client_snapshot->>'postal_code', c.postal_code, '') AS postal_code,
            COALESCE(t.client_snapshot->>'phone', c.phone, '') AS phone,
            COALESCE(t.client_snapshot->>'email', c.email, '') AS email,
            CASE
              WHEN t.client_snapshot ? 'identifications'
                THEN COALESCE(t.client_snapshot->'identifications'->0->>'id_type', '')
              ELSE COALESCE(primary_id.id_type, '')
            END AS id_type,
            CASE
              WHEN t.client_snapshot ? 'identifications'
                THEN COALESCE(t.client_snapshot->'identifications'->0->>'id_value', '')
              ELSE COALESCE(primary_id.id_value, '')
            END AS id_value,
            CASE
              WHEN t.client_snapshot ? 'identifications'
                THEN COALESCE(t.client_snapshot->'identifications'->1->>'id_type', '')
              ELSE COALESCE(secondary_id.id_type, '')
            END AS id_type_2,
            CASE
              WHEN t.client_snapshot ? 'identifications'
                THEN COALESCE(t.client_snapshot->'identifications'->1->>'id_value', '')
              ELSE COALESCE(secondary_id.id_value, '')
            END AS id_value_2,
            COALESCE(t.client_snapshot->>'image_path', c.image_path, '') AS client_image_path,
            COALESCE((ti.item_snapshot->>'item_number')::bigint, i.item_number) AS item_number,
            COALESCE((ti.item_snapshot->>'quantity')::integer, i.quantity) AS quantity,
            COALESCE(ti.item_snapshot->>'category_name', ic.name, '') AS category_name,
            COALESCE(ti.item_snapshot->>'description', i.description, '') AS description,
            COALESCE(ti.item_snapshot->>'brand_name', i.brand_name, '') AS brand_name,
            COALESCE(ti.item_snapshot->>'model_number', i.model_number, '') AS model_number,
            COALESCE(ti.item_snapshot->>'serial_number', i.serial_number, '') AS serial_number,
            COALESCE((ti.item_snapshot->>'amount')::numeric, i.amount) AS item_amount,
            COALESCE(ti.item_snapshot->>'image_path', i.image_path, '') AS item_image_path
          FROM ticket t
          LEFT JOIN client c ON c.client_number = t.client_number
          LEFT JOIN LATERAL (
            SELECT ci.id_type, ci.id_value
            FROM client_id ci
            WHERE ci.client_number = c.client_number
            ORDER BY ci.id ASC
            LIMIT 1
          ) primary_id ON TRUE
          LEFT JOIN LATERAL (
            SELECT ci.id_type, ci.id_value
            FROM client_id ci
            WHERE ci.client_number = c.client_number
            ORDER BY ci.id ASC
            OFFSET 1
            LIMIT 1
          ) secondary_id ON TRUE
          LEFT JOIN ticket_item ti ON ti.ticket_number = t.ticket_number
          LEFT JOIN item i ON i.item_number = ti.item_number
          LEFT JOIN item_subcategory isc ON isc.id = i.subcategory_id
          LEFT JOIN item_category ic ON ic.id = isc.category_id
          WHERE t.transaction_datetime >= $1::date
            AND t.transaction_datetime < ($2::date + INTERVAL '1 day')
          ORDER BY t.transaction_datetime ASC, t.ticket_number ASC, i.item_number ASC
          LIMIT 20001
        `,
        [fromDate, toDate],
      );

      return result.rows.map(mapRow);
    } finally {
      client.release();
    }
  },

  loadSubmissionMap: async (
    identities: XmlReportSubmissionIdentity[],
    environment: XmlReportEnvironment,
  ): Promise<Map<string, XmlReportSubmissionRecord>> => {
    if (!identities.length) {
      return new Map();
    }

    const client = await connect();
    try {
      const result = await client.query(
        `
          SELECT
            ticket_number,
            ticket_type,
            ticket_datetime,
            status,
            message,
            payload_hash
          FROM xml_report_submission
          WHERE environment = $1
            AND ticket_number = ANY($2::int[])
        `,
        [
          environment,
          [...new Set(identities.map((identity) => identity.ticket_number))],
        ],
      );

      return new Map(
        result.rows.map((row) => [
          getXmlSubmissionKey({
            ticket_number: number(row.ticket_number),
            ticket_type: text(row.ticket_type) as "Pawn" | "Buy",
            ticket_datetime: text(row.ticket_datetime),
          }),
          {
            ticket_number: number(row.ticket_number),
            ticket_type: text(row.ticket_type) as "Pawn" | "Buy",
            ticket_datetime: text(row.ticket_datetime),
            status: text(row.status) as XmlReportSubmissionRecord["status"],
            message: text(row.message),
            payload_hash: text(row.payload_hash),
          },
        ]),
      );
    } finally {
      client.release();
    }
  },

  claimSubmission: async (
    input: XmlReportSubmissionIdentity & {
      environment: XmlReportEnvironment;
      payload_hash: string;
    },
  ): Promise<{ claimed: boolean; use_update: boolean; message: string }> =>
    runInTransaction("claimXmlReportSubmission", async (client) => {
      const lockKey = `${input.environment}:${getXmlSubmissionKey(input)}`;
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        lockKey,
      ]);

      const existingResult = await client.query(
        `
          SELECT
            status,
            payload_hash,
            submitted_at,
            last_attempt_at > CURRENT_TIMESTAMP - INTERVAL '5 minutes'
              AS is_recent
          FROM xml_report_submission
          WHERE ticket_number = $1
            AND ticket_type = $2
            AND ticket_datetime = $3
            AND environment = $4
          FOR UPDATE
        `,
        [
          input.ticket_number,
          input.ticket_type,
          input.ticket_datetime,
          input.environment,
        ],
      );
      const existing = existingResult.rows[0];

      if (
        existing?.status === "submitted" &&
        text(existing.payload_hash) === input.payload_hash
      ) {
        return {
          claimed: false,
          use_update: false,
          message: "Already submitted.",
        };
      }

      if (existing?.status === "submitting" && existing.is_recent) {
        return {
          claimed: false,
          use_update: false,
          message: "This ticket is already being submitted.",
        };
      }

      const useUpdate = Boolean(existing?.submitted_at);

      if (existing) {
        await client.query(
          `
            UPDATE xml_report_submission
            SET
              status = 'submitting',
              payload_hash = $5,
              attempt_count = attempt_count + 1,
              error_code = NULL,
              message = '',
              last_attempt_at = CURRENT_TIMESTAMP
            WHERE ticket_number = $1
              AND ticket_type = $2
              AND ticket_datetime = $3
              AND environment = $4
          `,
          [
            input.ticket_number,
            input.ticket_type,
            input.ticket_datetime,
            input.environment,
            input.payload_hash,
          ],
        );
      } else {
        await client.query(
          `
            INSERT INTO xml_report_submission (
              ticket_number,
              ticket_type,
              ticket_datetime,
              environment,
              status,
              payload_hash
            ) VALUES ($1, $2, $3, $4, 'submitting', $5)
          `,
          [
            input.ticket_number,
            input.ticket_type,
            input.ticket_datetime,
            input.environment,
            input.payload_hash,
          ],
        );
      }

      return { claimed: true, use_update: useUpdate, message: "" };
    }),

  completeSubmission: async (
    input: XmlReportSubmissionIdentity & {
      environment: XmlReportEnvironment;
      payload_hash: string;
      status: "submitted" | "failed";
      error_code: number;
      message: string;
    },
  ): Promise<void> => {
    const client = await connect();
    try {
      await client.query(
        `
          UPDATE xml_report_submission
          SET
            status = $5,
            payload_hash = $6,
            error_code = $7,
            message = $8,
            submitted_at = CASE
              WHEN $5 = 'submitted' THEN CURRENT_TIMESTAMP
              ELSE submitted_at
            END,
            last_attempt_at = CURRENT_TIMESTAMP
          WHERE ticket_number = $1
            AND ticket_type = $2
            AND ticket_datetime = $3
            AND environment = $4
        `,
        [
          input.ticket_number,
          input.ticket_type,
          input.ticket_datetime,
          input.environment,
          input.status,
          input.payload_hash,
          input.error_code,
          input.message,
        ],
      );
    } finally {
      client.release();
    }
  },
};
