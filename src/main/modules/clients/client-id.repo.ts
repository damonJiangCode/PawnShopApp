import { connect } from "../../database/connection.ts";
import type { ID } from "../../../shared/models/client.model.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

const getDbClient = async (dbClient?: DbClient) =>
  dbClient ?? (await connect());

const normalizeIdPart = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

const getIdKey = (id: ID) =>
  `${id.id_type.trim().toUpperCase()}\u0000${normalizeIdPart(id.id_value)}`;

export const clientIdRepo = {
  assertNewIdsAvailable: async (
    ids: ID[],
    existingIds: ID[],
    currentClientNumber: number | null,
    dbClient: DbClient,
  ): Promise<string | null> => {
    const existingKeys = new Set(existingIds.map(getIdKey));
    const incomingKeys = ids.map(getIdKey);

    if (new Set(incomingKeys).size !== incomingKeys.length) {
      return "The same identification was entered more than once.";
    }

    const newIds = ids
      .filter((id) => !existingKeys.has(getIdKey(id)))
      .sort((left, right) => getIdKey(left).localeCompare(getIdKey(right)));

    for (const id of newIds) {
      const normalizedType = id.id_type.trim().toUpperCase();
      const normalizedValue = normalizeIdPart(id.id_value);

      await dbClient.query(
        "SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))",
        [normalizedType, normalizedValue],
      );

      const conflict = await dbClient.query(
        `
          SELECT client_number
          FROM client_id
          WHERE UPPER(TRIM(id_type)) = $1
            AND UPPER(REGEXP_REPLACE(id_value, '[^A-Za-z0-9]', '', 'g')) = $2
            AND ($3::integer IS NULL OR client_number <> $3)
          LIMIT 1
        `,
        [normalizedType, normalizedValue, currentClientNumber],
      );

      if (conflict.rowCount) {
        return `${id.id_type} ${id.id_value} is already assigned to another client.`;
      }
    }

    return null;
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
};
