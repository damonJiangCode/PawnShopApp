export const createCustomerIDTable = `
  CREATE TABLE IF NOT EXISTS customer_identification (
    id SERIAL PRIMARY KEY,
    customer_number INTEGER REFERENCES customer(customer_number) ON DELETE CASCADE,
    identification_type VARCHAR(50) NOT NULL,
    identification_number VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
