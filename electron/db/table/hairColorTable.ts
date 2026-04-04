export const createHairColorTable = `CREATE TABLE IF NOT EXISTS hair_color(
  id SERIAL PRIMARY KEY,
  color TEXT NOT NULL
);`;

export const insertHairColor = `
INSERT INTO hair_color (color)
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
  FROM hair_color h
  WHERE h.color = v.color
);
`;
