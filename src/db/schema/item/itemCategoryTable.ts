export const createItemCategoryTable = `
  CREATE TABLE IF NOT EXISTS item_category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
  );
`;

export const insertItemCategory = `
  INSERT INTO item_category (name)
  SELECT v.name
  FROM (
    VALUES
      ('JEWELRY'),
      ('ELECTRONICS'),
      ('AUDIO EQUIPMENT'),
      ('POWER TOOLS'),
      ('HAND TOOLS'),
      ('UTILITY TOOLS'),
      ('DRYWALL TOOLS'),
      ('MUSICAL INSTRUMENTS'),
      ('COLLECTIBLES'),
      ('SPORTS & OUTDOOR'),
      ('APPLIANCE'),
      ('APPAREL'),
      ('BABY & KIDS')
  ) AS v(name)
  WHERE NOT EXISTS (
    SELECT 1
    FROM item_category c
    WHERE c.name = v.name
  );
`;
