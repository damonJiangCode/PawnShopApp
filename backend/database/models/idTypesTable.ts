export const createIdTypesTable = `
  CREATE TABLE IF NOT EXISTS id_types (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE
  );
`;

export const insertIdTypes = `
  INSERT INTO id_types (type) VALUES
    ('Driver''s License'),
    ('Health Card'),
    ('Indian Status Card'),
    ('Birth Certificate'),
    ('Social Insurance Number Card'),
    ('Firearms License'),
    ('Canadian Passport'),
    ('Citizenship Card'),
    ('Permanent Resident Card'),
    ('Military ID'),
    ('Other')
  ON CONFLICT (name) DO NOTHING;
`;
