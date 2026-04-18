export const createItemTable = `
  CREATE TABLE IF NOT EXISTS item (
    item_number SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    subcategory_id INTEGER REFERENCES item_subcategory(id),
    description TEXT,
    brand_name TEXT,
    model_number TEXT,
    serial_number TEXT,
    amount NUMERIC(10,1),
    item_ticket_status JSONB,
    image_path TEXT
);
`;

export const createItemIndexes = `
  CREATE INDEX IF NOT EXISTS idx_item_subcategory_id
  ON item(subcategory_id);
`;
