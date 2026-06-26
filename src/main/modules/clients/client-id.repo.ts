import { connect } from "../../database/connection.ts";
import type { ID } from "../../../shared/types/Client.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

const getDbClient = async (dbClient?: DbClient) =>
  dbClient ?? (await connect());

export const clientIdRepo = {
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
