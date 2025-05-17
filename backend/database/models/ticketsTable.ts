export const createTicketsTable = `
  CREATE TABLE IF NOT EXISTS tickets (
    ticket_number SERIAL PRIMARY KEY,
    pawn_datetime TIMESTAMP NOT NULL,
    due_date DATE NOT NULL,
    pickup_datetime TIMESTAMP,
    location VARCHAR(100),
    description TEXT,
    pawn_price INTEGER,
    interest INTEGER,
    pickup_price INTEGER,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pawned', 'picked_up', 'expired')),
    employee_id INTEGER,
    customer_number INTEGER REFERENCES customers(customer_number) ON DELETE SET NULL
  );
`;
