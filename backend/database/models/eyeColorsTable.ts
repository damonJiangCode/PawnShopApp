export const createEyeColorsTable = `CREATE TABLE IF NOT EXISTS eye_colors(
  id SERIAL PRIMARY KEY,
  color TEXT NOT NULL
);`;

export const insertEyeColors = `INSERT INTO eye_colors (color) VALUES
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
('Other');`;
