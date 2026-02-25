export const createIDTypesTable = `
  CREATE TABLE IF NOT EXISTS id_types (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
  );
`;

export const insertIDTypes = `
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
`;
