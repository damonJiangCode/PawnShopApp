export const createHairColorsTable = `CREATE TABLE IF NOT EXISTS hair_colors(
  id SERIAL PRIMARY KEY,
  color TEXT NOT NULL
);`;

export const insertHairColors = `
INSERT INTO hair_colors (color)
SELECT v.color
FROM (
  VALUES
    ('Black'),
    ('Dark Brown'),
    ('Brown'),
    ('Light Brown'),
    ('Blonde'),
    ('Dark Blonde'),
    ('Light Blonde'),
    ('Red'),
    ('Gray'),
    ('White'),
    ('Bald'),
    ('Blue'),
    ('Pink'),
    ('Purple'),
    ('Green'),
    ('Other')
) AS v(color)
WHERE NOT EXISTS (
  SELECT 1
  FROM hair_colors h
  WHERE h.color = v.color
);
`;
