import { connect } from "../../database/connection.ts";
import type { Employee } from "../../../shared/models/employee.model.ts";
import type {
  CreateEmployeeInput,
  EmployeeSearchInput,
  UpdateEmployeeInput,
} from "../../../shared/payload-contracts/employee.contract.ts";
import {
  hashPassword,
  getPasswordLookup,
  isPasswordHash,
  verifyPassword,
} from "../../shared/passwordHash.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;
type CreateEmployeeRecord = Omit<CreateEmployeeInput, "manager_password"> & {
  password_lookup: string;
};
type UpdateEmployeeRecord = Omit<UpdateEmployeeInput, "manager_password"> & {
  password_lookup?: string;
};

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
  is_terminated,
  is_manager,
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
  is_terminated: Boolean(row.is_terminated),
  is_manager: Boolean(row.is_manager),
  address: row.address ? String(row.address) : "",
  phone: row.phone ? String(row.phone) : "",
  email: row.email ? String(row.email) : "",
  created_at: row.created_at ? new Date(String(row.created_at)) : undefined,
  updated_at: row.updated_at ? new Date(String(row.updated_at)) : undefined,
});

const findPasswordMatch = async (
  password: string,
  client: DbClient,
  options: { includeTerminated: boolean; managerOnly: boolean },
): Promise<EmployeeMatch | null> => {
  const result = await client.query(
    `
      SELECT employee_number, first_name, last_name, nickname, password
      FROM employee
      WHERE ($1::boolean OR is_terminated = FALSE)
        AND (NOT $2::boolean OR is_manager = TRUE)
        AND password_lookup = $3
      ORDER BY employee_number
    `,
    [
      options.includeTerminated,
      options.managerOnly,
      getPasswordLookup(password),
    ],
  );

  for (const row of result.rows) {
    const storedPassword = String(row.password ?? "");

    if (!(await verifyPassword(password, storedPassword))) {
      continue;
    }

    if (!isPasswordHash(storedPassword)) {
      await client.query(
        `
          UPDATE employee
          SET password = $1, password_lookup = $2
          WHERE employee_number = $3
        `,
        [
          await hashPassword(password),
          getPasswordLookup(password),
          row.employee_number,
        ],
      );
    }

    return {
      employee_number: Number(row.employee_number),
      first_name: String(row.first_name ?? ""),
      last_name: String(row.last_name ?? ""),
      nickname: String(row.nickname ?? ""),
    };
  }

  return null;
};

export const employeeRepo = {
  findByPassword: async (
    password: string,
    dbClient?: DbClient,
    includeTerminated = false,
  ): Promise<EmployeeMatch | null> => {
    const client = dbClient ?? (await connect());

    try {
      return findPasswordMatch(password, client, {
        includeTerminated,
        managerOnly: false,
      });
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  findActiveManagerByPassword: async (
    password: string,
    dbClient?: DbClient,
  ): Promise<EmployeeMatch | null> => {
    const client = dbClient ?? (await connect());

    try {
      return findPasswordMatch(password, client, {
        includeTerminated: false,
        managerOnly: true,
      });
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  findByEmployeeNumber: async (
    employeeNumber: number,
    dbClient?: DbClient,
  ): Promise<Employee | null> => {
    const client = dbClient ?? (await connect());

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
      if (!dbClient) {
        client.release();
      }
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
          LIMIT 200
        `,
        values,
      );

      return result.rows.map(mapEmployeeRow);
    } finally {
      client.release();
    }
  },

  hasOtherActiveManager: async (
    employeeNumber: number,
    dbClient?: DbClient,
  ): Promise<boolean> => {
    const client = dbClient ?? (await connect());

    try {
      const result = await client.query(
        `
          SELECT EXISTS (
            SELECT 1
            FROM employee
            WHERE employee_number <> $1
              AND is_manager = TRUE
              AND is_terminated = FALSE
          ) AS has_other_manager
        `,
        [employeeNumber],
      );

      return Boolean(result.rows[0]?.has_other_manager);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  create: async (
    payload: CreateEmployeeRecord,
    dbClient?: DbClient,
  ): Promise<Employee> => {
    const client = dbClient ?? (await connect());

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
            password_lookup,
            is_terminated,
            is_manager,
            address,
            phone,
            email
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING ${employeeSelectColumns}
        `,
        [
          payload.first_name,
          payload.last_name,
          payload.nickname,
          payload.date_of_birth,
          payload.gender,
          payload.password,
          payload.password_lookup,
          payload.is_terminated,
          payload.is_manager,
          payload.address,
          payload.phone,
          payload.email,
        ],
      );

      return mapEmployeeRow(result.rows[0]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  update: async (
    employeeNumber: number,
    payload: UpdateEmployeeRecord,
    dbClient?: DbClient,
  ): Promise<Employee> => {
    const client = dbClient ?? (await connect());

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
            password = COALESCE($7, password),
            password_lookup = COALESCE($8, password_lookup),
            is_terminated = $9,
            is_manager = $10,
            address = $11,
            phone = $12,
            email = $13,
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
          payload.password ?? null,
          payload.password_lookup ?? null,
          payload.is_terminated,
          payload.is_manager,
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
      if (!dbClient) {
        client.release();
      }
    }
  },

  lockForAdministration: async (dbClient: DbClient): Promise<void> => {
    await dbClient.query("LOCK TABLE employee IN SHARE ROW EXCLUSIVE MODE");
  },
};
