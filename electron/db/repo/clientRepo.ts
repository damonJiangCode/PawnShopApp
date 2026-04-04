import type { Client, ID } from "../../../shared/types/Client.ts";
import { connect } from "../table/createTable.ts";

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
  hair_color: row.hair_color ?? "",
  eye_color: row.eye_color ?? "",
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
  updated_at: row.updated_at,
  redeem_count: row.redeem_count ?? 0,
  expire_count: row.expire_count ?? 0,
  overdue_count: row.overdue_count ?? 0,
  theft_count: row.theft_count ?? 0,
  identifications: row.identifications ?? [],
});

const getClient = async (dbClient?: DbClient) => dbClient ?? (await connect());

export const searchClientsByName = async (
  firstName: string,
  lastName: string,
  dbClient?: DbClient,
): Promise<Client[]> => {
  const client = await getClient(dbClient);
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
    const clients = result.rows.map(mapRowToClient);

    return clients;
  } finally {
    if (!dbClient) {
      client.release();
    }
  }
};

export const insertClient = async (
  clientData: Client,
  dbClient?: DbClient,
): Promise<{ client_number: number; updated_at: Date }> => {
  const client = await getClient(dbClient);
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
      redeem_count,
      expire_count,
      overdue_count,
      theft_count
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
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
    clientData.redeem_count ?? 0,
    clientData.expire_count ?? 0,
    clientData.overdue_count ?? 0,
    clientData.theft_count ?? 0,
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
};

export const updateClientRecord = async (
  clientData: Client,
  dbClient?: DbClient,
): Promise<{ updated_at: Date }> => {
  const client = await getClient(dbClient);
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
      redeem_count = $19,
      expire_count = $20,
      overdue_count = $21,
      theft_count = $22,
      updated_at = CURRENT_TIMESTAMP
    WHERE client_number = $23
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
    clientData.redeem_count ?? 0,
    clientData.expire_count ?? 0,
    clientData.overdue_count ?? 0,
    clientData.theft_count ?? 0,
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
};

export const insertClientIds = async (
  clientNumber: number,
  ids: ID[],
  dbClient?: DbClient,
): Promise<ID[]> => {
  const client = await getClient(dbClient);
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
};

export const deleteClientIds = async (
  clientNumber: number,
  dbClient?: DbClient,
): Promise<void> => {
  const client = await getClient(dbClient);

  try {
    await client.query(`DELETE FROM client_id WHERE client_number = $1`, [
      clientNumber,
    ]);
  } finally {
    if (!dbClient) {
      client.release();
    }
  }
};

export const deleteClientByNumber = async (
  clientNumber: number,
  dbClient?: DbClient,
): Promise<boolean> => {
  const client = await getClient(dbClient);

  try {
    const result = await client.query(
      `DELETE FROM client WHERE client_number = $1`,
      [clientNumber],
    );
    return result.rowCount > 0;
  } finally {
    if (!dbClient) {
      client.release();
    }
  }
};
