import { connect } from "../table/createTable.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

export interface EmployeeMatch {
  employee_number: number;
  first_name: string;
  last_name: string;
}

export const employeeRepo = {
  findByPassword: async (
    password: string,
    dbClient?: DbClient,
  ): Promise<EmployeeMatch | null> => {
    const client = dbClient ?? (await connect());

    try {
      const result = await client.query(
        `
          SELECT employee_number, first_name, last_name
          FROM employee
          WHERE password = $1
          LIMIT 1
        `,
        [password],
      );

      return result.rows[0] ?? null;
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },
};
