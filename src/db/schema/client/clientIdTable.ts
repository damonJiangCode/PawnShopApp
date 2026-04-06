export const createClientIDTable = `
  CREATE TABLE IF NOT EXISTS client_id (
    id SERIAL PRIMARY KEY,
    client_number INTEGER REFERENCES client(client_number) ON DELETE CASCADE,
    id_type TEXT NOT NULL,
    id_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
`;
