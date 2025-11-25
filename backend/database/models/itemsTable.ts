export const createItemsTable = `
  CREATE TABLE IF NOT EXISTS items (
    item_number SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    description TEXT,
    brand_name VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    pawn_price INTEGER,
    ticket_number INTEGER REFERENCES tickets(ticket_number),
    customer_number INTEGER REFERENCES customers(customer_number)
  );
`;
