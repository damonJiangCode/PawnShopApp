export const createEmployeeTable = `
  CREATE TABLE IF NOT EXISTS employee (
    employee_number SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    nickname TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    gender TEXT NOT NULL DEFAULT '',
    password TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
