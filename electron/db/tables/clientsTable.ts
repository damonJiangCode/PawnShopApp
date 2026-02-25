export const createClientsTable = `
  CREATE TABLE IF NOT EXISTS clients (
    client_number SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    date_of_birth DATE,
    gender TEXT,
    hair_color TEXT,
    eye_color TEXT,
    height_cm NUMERIC(5,1),
    weight_kg NUMERIC(5,1),
    address TEXT,
    postal_code TEXT,
    city TEXT,
    province TEXT,
    country TEXT,
    email TEXT,
    phone TEXT,
    notes TEXT,
    image_path TEXT,
    redeem_count INTEGER,      
    expire_count INTEGER,      
    overdue_count INTEGER,    
    theft_count INTEGER,    
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
`;
