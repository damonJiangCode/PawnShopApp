export const createEyeColorsTable = `CREATE TABLE IF NOT EXISTS eye_colors(
  id SERIAL PRIMARY KEY,
  color TEXT NOT NULL
);`;

export const insertEyeColors = `
INSERT INTO eye_colors (color)
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
  FROM eye_colors e
  WHERE e.color = v.color
);
`;
