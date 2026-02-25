export const createIDTypesTable = `
  CREATE TABLE IF NOT EXISTS id_types (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
  );
`;

export const insertIDTypes = `
  INSERT INTO id_types (type)
  SELECT v.type
  FROM (
    VALUES
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
  ) AS v(type)
  WHERE NOT EXISTS (
    SELECT 1
    FROM id_types t
    WHERE t.type = v.type
  )
`;
