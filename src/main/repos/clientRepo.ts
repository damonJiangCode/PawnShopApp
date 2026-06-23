import type { Client, ID } from "../../shared/types/Client.ts";
import type { CitiesResponse } from "../../shared/types/clientPayload.ts";
import type { HairColor } from "../../shared/types/hairColor.ts";
import type { EyeColor } from "../../shared/types/eyeColor.ts";
import { connect } from "../../db/connection.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

const normalize = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }

  return value ?? null;
};

const mapRowToClient = (row: any): Client => ({
  client_number: row.client_number,
  first_name: row.first_name,
  last_name: row.last_name,
  middle_name: row.middle_name ?? "",
  date_of_birth: row.date_of_birth,
  gender: row.gender ?? "",
  hair_color: row.hair_color ? String(row.hair_color).toUpperCase() : "",
  eye_color: row.eye_color ? String(row.eye_color).toUpperCase() : "",
  height_cm: row.height_cm,
  weight_kg: row.weight_kg,
  address: row.address ?? "",
  postal_code: row.postal_code ?? "",
  city: row.city ?? "",
  province: row.province ?? "",
  country: row.country ?? "",
  email: row.email ?? "",
  phone: row.phone ?? "",
  notes: row.notes ?? "",
  image_path: row.image_path ?? "",
  pickup_self_only: Boolean(row.pickup_self_only),
  updated_at: row.updated_at,
  redeem_count: row.redeem_count ?? 0,
  sold_count: row.sold_count ?? 0,
  expire_count: row.expire_count ?? 0,
  overdue_count: row.overdue_count ?? 0,
  identifications: row.identifications ?? [],
});

const getDbClient = async (dbClient?: DbClient) =>
  dbClient ?? (await connect());

export const clientRepo = {
  loadByNumber: async (
    clientNumber: number,
    dbClient?: DbClient,
  ): Promise<Client | null> => {
    const client = await getDbClient(dbClient);
    const query = `
      SELECT
        c.*,
        COALESCE(ci.identifications, '[]') AS identifications
      FROM client c
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', client_id.id,
            'id_type', client_id.id_type,
            'id_value', client_id.id_value,
            'updated_at', client_id.updated_at
          )
          ORDER BY client_id.id
        ) AS identifications
        FROM client_id
        WHERE client_id.client_number = c.client_number
      ) ci ON TRUE
      WHERE c.client_number = $1
      LIMIT 1
    `;

    try {
      const result = await client.query(query, [clientNumber]);
      return result.rows[0] ? mapRowToClient(result.rows[0]) : null;
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  searchByName: async (
    firstName: string,
    lastName: string,
    dbClient?: DbClient,
  ): Promise<Client[]> => {
    const client = await getDbClient(dbClient);
    const query = `
      SELECT
        c.*,
        COALESCE(ci.identifications, '[]') AS identifications
      FROM client c
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', client_id.id,
            'id_type', client_id.id_type,
            'id_value', client_id.id_value,
            'updated_at', client_id.updated_at
          )
          ORDER BY client_id.id
        ) AS identifications
        FROM client_id
        WHERE client_id.client_number = c.client_number
      ) ci ON TRUE
      WHERE
        (LOWER(c.first_name) LIKE LOWER($1) || '%' OR $1 = '')
        AND
        (LOWER(c.last_name) LIKE LOWER($2) || '%' OR $2 = '')
      ORDER BY c.last_name, c.first_name, c.client_number
    `;
    const values = [
      firstName ? firstName.toLowerCase() : "",
      lastName ? lastName.toLowerCase() : "",
    ];

    try {
      const result = await client.query(query, values);
      return result.rows.map(mapRowToClient);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  searchByDob: async (
    dateOfBirth: string,
    dbClient?: DbClient,
  ): Promise<Client[]> => {
    const client = await getDbClient(dbClient);
    const query = `
      SELECT
        c.*,
        COALESCE(ci.identifications, '[]') AS identifications
      FROM client c
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', client_id.id,
            'id_type', client_id.id_type,
            'id_value', client_id.id_value,
            'updated_at', client_id.updated_at
          )
          ORDER BY client_id.id
        ) AS identifications
        FROM client_id
        WHERE client_id.client_number = c.client_number
      ) ci ON TRUE
      WHERE c.date_of_birth = $1::date
      ORDER BY c.last_name, c.first_name, c.client_number
    `;

    try {
      const result = await client.query(query, [dateOfBirth]);
      return result.rows.map(mapRowToClient);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  create: async (
    clientData: Client,
    dbClient?: DbClient,
  ): Promise<{ client_number: number; updated_at: Date }> => {
    const client = await getDbClient(dbClient);
    const query = `
      INSERT INTO client (
        first_name,
        last_name,
        middle_name,
        date_of_birth,
        gender,
        hair_color,
        eye_color,
        height_cm,
        weight_kg,
        address,
        postal_code,
        city,
        province,
        country,
        email,
        phone,
        notes,
        image_path,
        pickup_self_only,
        redeem_count,
        sold_count,
        expire_count,
        overdue_count
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
      )
      RETURNING client_number, updated_at
    `;

    const values = [
      normalize(clientData.first_name),
      normalize(clientData.last_name),
      normalize(clientData.middle_name),
      normalize(clientData.date_of_birth),
      normalize(clientData.gender),
      normalize(clientData.hair_color),
      normalize(clientData.eye_color),
      clientData.height_cm ?? null,
      clientData.weight_kg ?? null,
      normalize(clientData.address),
      normalize(clientData.postal_code),
      normalize(clientData.city),
      normalize(clientData.province),
      normalize(clientData.country),
      normalize(clientData.email),
      normalize(clientData.phone),
      normalize(clientData.notes),
      normalize(clientData.image_path),
      Boolean(clientData.pickup_self_only),
      clientData.redeem_count ?? 0,
      clientData.sold_count ?? 0,
      clientData.expire_count ?? 0,
      clientData.overdue_count ?? 0,
    ];

    try {
      const result = await client.query(query, values);
      return {
        client_number: result.rows[0].client_number as number,
        updated_at: result.rows[0].updated_at as Date,
      };
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  update: async (
    clientData: Client,
    dbClient?: DbClient,
  ): Promise<{ updated_at: Date }> => {
    const client = await getDbClient(dbClient);
    const clientNumber = clientData.client_number;

    if (!clientNumber) {
      throw new Error("Missing client_number for update");
    }

    const query = `
      UPDATE client
      SET
        first_name = $1,
        last_name = $2,
        middle_name = $3,
        date_of_birth = $4,
        gender = $5,
        hair_color = $6,
        eye_color = $7,
        height_cm = $8,
        weight_kg = $9,
        address = $10,
        postal_code = $11,
        city = $12,
        province = $13,
        country = $14,
        email = $15,
        phone = $16,
        notes = $17,
        image_path = $18,
        pickup_self_only = $19,
        redeem_count = $20,
        sold_count = $21,
        expire_count = $22,
        overdue_count = $23,
        updated_at = CURRENT_TIMESTAMP
      WHERE client_number = $24
      RETURNING updated_at
    `;

    const values = [
      normalize(clientData.first_name),
      normalize(clientData.last_name),
      normalize(clientData.middle_name),
      normalize(clientData.date_of_birth),
      normalize(clientData.gender),
      normalize(clientData.hair_color),
      normalize(clientData.eye_color),
      clientData.height_cm ?? null,
      clientData.weight_kg ?? null,
      normalize(clientData.address),
      normalize(clientData.postal_code),
      normalize(clientData.city),
      normalize(clientData.province),
      normalize(clientData.country),
      normalize(clientData.email),
      normalize(clientData.phone),
      normalize(clientData.notes),
      normalize(clientData.image_path),
      Boolean(clientData.pickup_self_only),
      clientData.redeem_count ?? 0,
      clientData.sold_count ?? 0,
      clientData.expire_count ?? 0,
      clientData.overdue_count ?? 0,
      clientNumber,
    ];

    try {
      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error(`Client not found: ${clientNumber}`);
      }

      return {
        updated_at: result.rows[0].updated_at as Date,
      };
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  updateImagePath: async (
    clientNumber: number,
    imagePath: string,
    dbClient?: DbClient,
  ): Promise<void> => {
    const client = await getDbClient(dbClient);

    try {
      await client.query(
        `
          UPDATE client
          SET image_path = $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE client_number = $2
        `,
        [imagePath, clientNumber],
      );
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  incrementSoldCount: async (
    clientNumber: number,
    dbClient?: DbClient,
  ): Promise<void> => {
    const client = await getDbClient(dbClient);

    try {
      await client.query(
        `
          UPDATE client
          SET sold_count = COALESCE(sold_count, 0) + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE client_number = $1
        `,
        [clientNumber],
      );
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  incrementExpireCount: async (
    clientNumber: number,
    dbClient?: DbClient,
  ): Promise<void> => {
    const client = await getDbClient(dbClient);

    try {
      await client.query(
        `
          UPDATE client
          SET expire_count = COALESCE(expire_count, 0) + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE client_number = $1
        `,
        [clientNumber],
      );
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  insertIds: async (
    clientNumber: number,
    ids: ID[],
    dbClient?: DbClient,
  ): Promise<ID[]> => {
    const client = await getDbClient(dbClient);
    const insertedIds: ID[] = [];

    try {
      for (const id of ids ?? []) {
        if (!id.id_type?.trim() || !id.id_value?.trim()) {
          continue;
        }

        const result = await client.query(
          `
            INSERT INTO client_id (client_number, id_type, id_value)
            VALUES ($1, $2, $3)
            RETURNING id, id_type, id_value, updated_at
          `,
          [clientNumber, id.id_type, id.id_value],
        );

        insertedIds.push({
          id: result.rows[0].id,
          client_number: clientNumber,
          id_type: result.rows[0].id_type,
          id_value: result.rows[0].id_value,
          updated_at: result.rows[0].updated_at,
        });
      }

      return insertedIds;
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  deleteIds: async (
    clientNumber: number,
    dbClient?: DbClient,
  ): Promise<void> => {
    const client = await getDbClient(dbClient);

    try {
      await client.query(`DELETE FROM client_id WHERE client_number = $1`, [
        clientNumber,
      ]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  deleteByNumber: async (
    clientNumber: number,
    dbClient?: DbClient,
  ): Promise<boolean> => {
    const client = await getDbClient(dbClient);

    try {
      const result = await client.query(
        `DELETE FROM client WHERE client_number = $1`,
        [clientNumber],
      );
      return (result.rowCount ?? 0) > 0;
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  loadCities: async (): Promise<CitiesResponse> => {
    const client = await connect();
    const provincesQuery =
      "SELECT DISTINCT province FROM city ORDER BY province ASC";
    const citiesQuery =
      "SELECT DISTINCT city, province FROM city ORDER BY province ASC, city ASC";

    try {
      const provincesResult = await client.query(provincesQuery);
      const citiesResult = await client.query(citiesQuery);

      const provinces = provincesResult.rows.map((row) => row.province);
      const citiesByProvince: Record<string, string[]> = {};

      for (const row of citiesResult.rows) {
        if (!citiesByProvince[row.province]) {
          citiesByProvince[row.province] = [];
        }

        citiesByProvince[row.province].push(row.city);
      }

      return { provinces, citiesByProvince };
    } finally {
      client.release();
    }
  },

  loadHairColors: async (): Promise<string[]> => {
    const client = await connect();
    const query = `
      SELECT UPPER(color) AS color
      FROM hair_color
      WHERE is_active = TRUE
      ORDER BY color ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => row.color);
    } finally {
      client.release();
    }
  },

  loadAdminHairColors: async (): Promise<HairColor[]> => {
    const client = await connect();
    const query = `
      SELECT UPPER(color) AS color, is_active
      FROM hair_color
      ORDER BY is_active DESC, color ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => ({
        color: String(row.color),
        is_active: Boolean(row.is_active),
      }));
    } finally {
      client.release();
    }
  },

  addHairColor: async (color: string): Promise<string | null> => {
    const client = await connect();
    const query = `
      INSERT INTO hair_color (color, is_active)
      SELECT $1, TRUE
      WHERE NOT EXISTS (
        SELECT 1 FROM hair_color WHERE LOWER(color) = LOWER($1)
      )
      RETURNING color
    `;

    try {
      const result = await client.query(query, [color]);
      return result.rows[0] ? String(result.rows[0].color) : null;
    } finally {
      client.release();
    }
  },

  deactivateHairColor: async (color: string): Promise<HairColor | null> => {
    const client = await connect();
    const query = `
      UPDATE hair_color
      SET is_active = FALSE
      WHERE UPPER(color) = $1 AND is_active = TRUE
      RETURNING UPPER(color) AS color, is_active
    `;

    try {
      const result = await client.query(query, [color]);
      const row = result.rows[0];
      return row
        ? {
            color: String(row.color),
            is_active: Boolean(row.is_active),
          }
        : null;
    } finally {
      client.release();
    }
  },

  activateHairColor: async (color: string): Promise<HairColor | null> => {
    const client = await connect();
    const query = `
      UPDATE hair_color
      SET is_active = TRUE
      WHERE UPPER(color) = $1 AND is_active = FALSE
      RETURNING UPPER(color) AS color, is_active
    `;

    try {
      const result = await client.query(query, [color]);
      const row = result.rows[0];
      return row
        ? {
            color: String(row.color),
            is_active: Boolean(row.is_active),
          }
        : null;
    } finally {
      client.release();
    }
  },

  loadEyeColors: async (): Promise<string[]> => {
    const client = await connect();
    const query = `
      SELECT UPPER(color) AS color
      FROM eye_color
      WHERE is_active = TRUE
      ORDER BY color ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => row.color);
    } finally {
      client.release();
    }
  },

  loadAdminEyeColors: async (): Promise<EyeColor[]> => {
    const client = await connect();
    const query = `
      SELECT UPPER(color) AS color, is_active
      FROM eye_color
      ORDER BY is_active DESC, color ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => ({
        color: String(row.color),
        is_active: Boolean(row.is_active),
      }));
    } finally {
      client.release();
    }
  },

  addEyeColor: async (color: string): Promise<string | null> => {
    const client = await connect();
    const query = `
      INSERT INTO eye_color (color, is_active)
      SELECT $1, TRUE
      WHERE NOT EXISTS (
        SELECT 1 FROM eye_color WHERE LOWER(color) = LOWER($1)
      )
      RETURNING color
    `;

    try {
      const result = await client.query(query, [color]);
      return result.rows[0] ? String(result.rows[0].color) : null;
    } finally {
      client.release();
    }
  },

  deactivateEyeColor: async (color: string): Promise<EyeColor | null> => {
    const client = await connect();
    const query = `
      UPDATE eye_color
      SET is_active = FALSE
      WHERE UPPER(color) = $1 AND is_active = TRUE
      RETURNING UPPER(color) AS color, is_active
    `;

    try {
      const result = await client.query(query, [color]);
      const row = result.rows[0];
      return row
        ? {
            color: String(row.color),
            is_active: Boolean(row.is_active),
          }
        : null;
    } finally {
      client.release();
    }
  },

  activateEyeColor: async (color: string): Promise<EyeColor | null> => {
    const client = await connect();
    const query = `
      UPDATE eye_color
      SET is_active = TRUE
      WHERE UPPER(color) = $1 AND is_active = FALSE
      RETURNING UPPER(color) AS color, is_active
    `;

    try {
      const result = await client.query(query, [color]);
      const row = result.rows[0];
      return row
        ? {
            color: String(row.color),
            is_active: Boolean(row.is_active),
          }
        : null;
    } finally {
      client.release();
    }
  },

  loadIdTypes: async (): Promise<string[]> => {
    const client = await connect();
    const query = "SELECT type FROM id_type ORDER BY type ASC";

    try {
      const result = await client.query(query);
      return result.rows.map((row) => row.type);
    } finally {
      client.release();
    }
  },
};
