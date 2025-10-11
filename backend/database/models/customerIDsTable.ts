export const createCustomerIDsTable = `
  CREATE TABLE IF NOT EXISTS customer_ids (
    id SERIAL PRIMARY KEY,
    customer_number INTEGER REFERENCES customers(customer_number) ON DELETE CASCADE,
    id_type VARCHAR(50) NOT NULL,
    id_number VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
