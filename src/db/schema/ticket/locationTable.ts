export const createLocationTable = `
  CREATE TABLE IF NOT EXISTS location (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL UNIQUE
  );
`;

export const insertLocation = async (client: any) => {
  try {
    await client.query(`
      INSERT INTO location (location)
      SELECT prefix || a::text || b::text
      FROM (
        VALUES
          ('BA'), ('BB'), ('BC'), ('BD'), ('BE'), ('BF'), ('BG'),
          ('BI'), ('BL'), ('BX'), ('BY')
      ) AS prefixes(prefix)
      CROSS JOIN generate_series(1, 8) AS a
      CROSS JOIN generate_series(1, 5) AS b
      ON CONFLICT (location) DO NOTHING
    `);

    await client.query(`
      INSERT INTO location (location)
      SELECT prefix || a::text || b::text
      FROM (
        VALUES
          ('AA'), ('AB'), ('AC'), ('AD'), ('AE'), ('AF'), ('AG')
      ) AS prefixes(prefix)
      CROSS JOIN generate_series(1, 8) AS a
      CROSS JOIN generate_series(1, 5) AS b
      ON CONFLICT (location) DO NOTHING
    `);

    await client.query(`
      INSERT INTO location (location)
      VALUES ('BIWK')
      ON CONFLICT (location) DO NOTHING
    `);
  } catch (err) {
    console.error("❌ Error inserting locations:", err);
    throw err;
  }
};
