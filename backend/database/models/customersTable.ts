export const createCustomersTable = `
  CREATE TABLE IF NOT EXISTS customers (
    customer_number SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(10),
    hair_color VARCHAR(20),
    eye_color VARCHAR(20),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    address TEXT,
    postal_code VARCHAR(20),
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    notes TEXT,
    picture_path TEXT,
    redeem_count INTEGER DEFAULT 0,      
    expire_count INTEGER DEFAULT 0,      
    overdue_count INTEGER DEFAULT 0,    
    theft_count INTEGER DEFAULT 0,    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
