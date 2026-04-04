export const createEyeColorTable = `CREATE TABLE IF NOT EXISTS eye_color(
  id SERIAL PRIMARY KEY,
  color TEXT NOT NULL
);`;

export const insertEyeColor = `
INSERT INTO eye_color (color)
SELECT v.color
FROM (
  VALUES
    ('Black'),
    ('Brown'),
    ('Dark Brown'),
    ('Light Brown'),
    ('Hazel'),
    ('Amber'),
    ('Green'),
    ('Blue'),
    ('Gray'),
    ('Violet'),
    ('Red'),
    ('Heterochromia'),
    ('Other')
) AS v(color)
WHERE NOT EXISTS (
  SELECT 1
  FROM eye_color e
  WHERE e.color = v.color
);
`;
