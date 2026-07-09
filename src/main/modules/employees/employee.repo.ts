import { connect } from "../../database/connection.ts";
import type { Employee } from "../../../shared/types/Employee.ts";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../../../shared/types/employeeApiTypes.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

export type EmployeeMatch = Pick<
  Employee,
  "employee_number" | "first_name" | "last_name" | "nickname"
>;

const employeeSelectColumns = `
  employee_number,
  first_name,
  last_name,
  nickname,
  date_of_birth,
  gender,
  password,
  is_terminated,
  address,
  phone,
  email,
  created_at,
  updated_at
`;

const formatDateOnly = (value: unknown) => {
  if (!value) {
    return "";
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
  password: row.password ? String(row.password) : "",
  is_terminated: Boolean(row.is_terminated),
  address: row.address ? String(row.address) : "",
  phone: row.phone ? String(row.phone) : "",
  email: row.email ? String(row.email) : "",
  created_at: row.created_at ? new Date(String(row.created_at)) : undefined,
  updated_at: row.updated_at ? new Date(String(row.updated_at)) : undefined,
});

export const employeeRepo = {
  findByPassword: async (
    password: string,
    dbClient?: DbClient,
    includeTerminated = false,
  ): Promise<EmployeeMatch | null> => {
    const client = dbClient ?? (await connect());

    try {
      const result = await client.query(
        `
          SELECT employee_number, first_name, last_name, nickname
          FROM employee
          WHERE password = $1
            AND ($2::boolean OR is_terminated = FALSE)
          LIMIT 1
        `,
        [password, includeTerminated],
      );

      return result.rows[0] ?? null;
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  findByEmployeeNumber: async (
    employeeNumber: number,
  ): Promise<Employee | null> => {
    const client = await connect();

    try {
      const result = await client.query(
        `
          SELECT ${employeeSelectColumns}
          FROM employee
          WHERE employee_number = $1
          LIMIT 1
        `,
        [employeeNumber],
      );

      return result.rows[0] ? mapEmployeeRow(result.rows[0]) : null;
    } finally {
      client.release();
    }
  },

  search: async (payload: EmployeeSearchInput): Promise<Employee[]> => {
    const client = await connect();
    const filters: string[] = [];
    const values: string[] = [];

    if (payload.last_name?.trim()) {
      values.push(`%${payload.last_name.trim()}%`);
      filters.push(`last_name ILIKE $${values.length}`);
    }

    if (payload.first_name?.trim()) {
      values.push(`%${payload.first_name.trim()}%`);
      filters.push(`first_name ILIKE $${values.length}`);
    }

    try {
      const result = await client.query(
        `
          SELECT ${employeeSelectColumns}
          FROM employee
          ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
          ORDER BY last_name, first_name, employee_number
        `,
        values,
      );

      return result.rows.map(mapEmployeeRow);
    } finally {
      client.release();
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
            password,
            is_terminated,
            address,
            phone,
            email
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING ${employeeSelectColumns}
        `,
        [
          payload.first_name,
          payload.last_name,
          payload.nickname,
          payload.date_of_birth,
          payload.gender,
          payload.password,
          payload.is_terminated,
          payload.address,
          payload.phone,
          payload.email,
        ],
      );

      return mapEmployeeRow(result.rows[0]);
    } finally {
      client.release();
    }
  },

  update: async (
    employeeNumber: number,
    payload: SaveEmployeeInput,
  ): Promise<Employee> => {
    const client = await connect();

    try {
      const result = await client.query(
        `
          UPDATE employee
          SET
            first_name = $2,
            last_name = $3,
            nickname = $4,
            date_of_birth = $5,
            gender = $6,
            password = $7,
            is_terminated = $8,
            address = $9,
            phone = $10,
            email = $11,
            updated_at = CURRENT_TIMESTAMP
          WHERE employee_number = $1
          RETURNING ${employeeSelectColumns}
        `,
        [
          employeeNumber,
          payload.first_name,
          payload.last_name,
          payload.nickname,
          payload.date_of_birth,
          payload.gender,
          payload.password,
          payload.is_terminated,
          payload.address,
          payload.phone,
          payload.email,
        ],
      );

      if (!result.rows[0]) {
        throw new Error("No employee was found for that number.");
      }

      return mapEmployeeRow(result.rows[0]);
    } finally {
      client.release();
    }
  },
};
