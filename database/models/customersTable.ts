export const createCustomersTable = `
  CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    height_cm DECIMAL(5,2),
    height_ft DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    weight_lb DECIMAL(5,2),
    notes TEXT,
    picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
