export const createCustomerIDsTable = `
  CREATE TABLE IF NOT EXISTS customer_ids (
    id SERIAL PRIMARY KEY,
    customer_number INTEGER REFERENCES customers(customer_number) ON DELETE CASCADE,
    id_type TEXT NOT NULL,
    id_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
