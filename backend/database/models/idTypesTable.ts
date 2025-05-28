export const createIdTypesTable = `
  CREATE TABLE IF NOT EXISTS id_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );
`;

export const insertIdTypes = `
  INSERT INTO id_types (name) VALUES
    ('Passport'),
    ('ID Card'),
    ('Driver License'),
    ('Health Card'),
    ('SIN Card'),
    ('Birth Certificate'),
    ('Citizenship Card'),
    ('Permanent Resident Card'),
    ('Military ID'),
    ('Travel Document'),
    ('Refugee Travel Document'),
    ('Other')
  ON CONFLICT (name) DO NOTHING;
`;
