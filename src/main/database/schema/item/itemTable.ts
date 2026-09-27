export const createItemTable = `
  CREATE TABLE IF NOT EXISTS item (
    item_number BIGSERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subcategory_id INTEGER NOT NULL REFERENCES item_subcategory(id),
    description TEXT NOT NULL,
    brand_name TEXT,
    model_number TEXT,
    serial_number TEXT,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    image_path TEXT NOT NULL
);
`;

export const createItemIndexes = `
  CREATE INDEX IF NOT EXISTS idx_item_subcategory_id
  ON item(subcategory_id);

  CREATE INDEX IF NOT EXISTS idx_item_brand_name_lower
  ON item(LOWER(brand_name));

  CREATE INDEX IF NOT EXISTS idx_item_model_number_lower
  ON item(LOWER(model_number));

  CREATE INDEX IF NOT EXISTS idx_item_serial_number_lower
  ON item(LOWER(serial_number));
`;
