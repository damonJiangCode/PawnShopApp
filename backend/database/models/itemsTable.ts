export const createItemsTable = `
  CREATE TABLE IF NOT EXISTS items (
    item_number SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    description TEXT,
    brand_name TEXT,
    model_number TEXT,
    serial_number TEXT,
    amount NUMERIC(10,1),
    item_ticket_status JSONB
);
`;
