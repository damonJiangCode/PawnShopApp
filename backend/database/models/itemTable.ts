export const createItemTable = `
  CREATE TABLE IF NOT EXISTS item (
    item_number SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    pawn_price INTEGER,
    ticket_number INTEGER REFERENCES ticket(ticket_number),
    customer_number INTEGER REFERENCES customer(customer_number)
  );
`;
