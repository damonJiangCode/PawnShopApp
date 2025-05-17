export const createHairColorsTable = `CREATE TABLE IF NOT EXISTS hair_colors(
  id SERIAL PRIMARY KEY,
  color VARCHAR(50) NOT NULL
);`;

export const insertHairColors = `INSERT INTO hair_colors (color) VALUES
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
('Other');`;
