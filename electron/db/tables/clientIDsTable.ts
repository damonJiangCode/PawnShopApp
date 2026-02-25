export const createClientIDsTable = `
  CREATE TABLE IF NOT EXISTS client_ids (
    id SERIAL PRIMARY KEY,
    client_number INTEGER REFERENCES clients(client_number) ON DELETE CASCADE,
    id_type TEXT NOT NULL,
    id_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
`;
