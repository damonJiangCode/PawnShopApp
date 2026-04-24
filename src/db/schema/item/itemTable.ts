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
    latest_ticket_number INTEGER REFERENCES ticket(ticket_number) ON DELETE SET NULL,
    image_path TEXT
);
`;

export const createItemIndexes = `
  CREATE INDEX IF NOT EXISTS idx_item_subcategory_id
  ON item(subcategory_id);

  CREATE INDEX IF NOT EXISTS idx_item_latest_ticket_number
  ON item(latest_ticket_number);
`;
