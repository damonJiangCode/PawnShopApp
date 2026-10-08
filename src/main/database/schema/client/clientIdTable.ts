export const createClientIDTable = `
  CREATE TABLE IF NOT EXISTS client_id (
    id SERIAL PRIMARY KEY,
    client_number INTEGER NOT NULL REFERENCES client(client_number) ON DELETE CASCADE,
    id_type TEXT NOT NULL REFERENCES id_type(type),
    id_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
`;

export const createClientIdLookupIndex = `
  CREATE INDEX IF NOT EXISTS idx_client_id_value_search
  ON client_id(UPPER(REGEXP_REPLACE(id_value, '[^A-Za-z0-9]', '', 'g')), client_number);
`;

export const createClientIdIndexes = `
  CREATE INDEX IF NOT EXISTS idx_client_id_client_number
  ON client_id(client_number, id);

  CREATE INDEX IF NOT EXISTS idx_client_id_normalized_value
  ON client_id(UPPER(TRIM(id_type)), UPPER(REGEXP_REPLACE(id_value, '[^A-Za-z0-9]', '', 'g')));

  ${createClientIdLookupIndex}
`;
