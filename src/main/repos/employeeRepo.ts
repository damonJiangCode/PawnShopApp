import { connect } from "../../db/connection.ts";
import type { Employee } from "../../shared/types/Employee.ts";
import type { SaveEmployeeInput } from "../../shared/types/employeePayload.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

export interface EmployeeMatch {
  employee_number: number;
  first_name: string;
  last_name: string;
  nickname: string;
}

const formatDateOnly = (value: unknown) => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
};

const mapEmployeeRow = (row: Record<string, unknown>): Employee => ({
  employee_number: Number(row.employee_number),
  first_name: row.first_name ? String(row.first_name) : "",
  last_name: row.last_name ? String(row.last_name) : "",
  nickname: row.nickname ? String(row.nickname) : "",
  date_of_birth: formatDateOnly(row.date_of_birth),
  gender: row.gender ? String(row.gender) : "",
  created_at: row.created_at ? new Date(String(row.created_at)) : undefined,
  updated_at: row.updated_at ? new Date(String(row.updated_at)) : undefined,
});

export const employeeRepo = {
  findByPassword: async (
    password: string,
    dbClient?: DbClient,
  ): Promise<EmployeeMatch | null> => {
    const client = dbClient ?? (await connect());

    try {
      const result = await client.query(
        `
          SELECT employee_number, first_name, last_name, nickname
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

  create: async (payload: SaveEmployeeInput): Promise<Employee> => {
    const client = await connect();

    try {
      const result = await client.query(
        `
          INSERT INTO employee (
            first_name,
            last_name,
            nickname,
            date_of_birth,
            gender,
            password
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING
            employee_number,
            first_name,
            last_name,
            nickname,
            date_of_birth,
            gender,
            created_at,
            updated_at
        `,
        [
          payload.first_name,
          payload.last_name,
          payload.nickname ?? "",
          payload.date_of_birth || null,
          payload.gender,
          payload.password,
        ],
      );

      return mapEmployeeRow(result.rows[0]);
    } finally {
      client.release();
    }
  },
};
