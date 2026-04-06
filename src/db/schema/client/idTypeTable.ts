export const createIDTypeTable = `
  CREATE TABLE IF NOT EXISTS id_type (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
  );
`;

export const insertIDType = `
  INSERT INTO id_type (type)
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
    FROM id_type t
    WHERE t.type = v.type
  )
`;
