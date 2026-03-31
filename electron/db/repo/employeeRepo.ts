import { connect } from "../tables/createTables.ts";

interface EmployeeMatch {
  employee_number: number;
  first_name: string;
  last_name: string;
}

export const findEmployeeByPassword = async (
  password: string
): Promise<EmployeeMatch | null> => {
  const dbClient = await connect();

  try {
    const result = await dbClient.query(
      `
        SELECT employee_number, first_name, last_name
        FROM employees
        WHERE password = $1
        LIMIT 1
      `,
      [password]
    );

    return result.rows[0] ?? null;
  } catch (error) {
    console.error(
      "[employeeRepository] ERROR: Failed to look up employee by password:",
      error
    );
    throw error;
  } finally {
    dbClient.release();
  }
};
