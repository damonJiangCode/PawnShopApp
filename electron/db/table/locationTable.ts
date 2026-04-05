export const createLocationTable = `
  CREATE TABLE IF NOT EXISTS location (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL UNIQUE
  );
`;
