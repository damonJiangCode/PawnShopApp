export const createTicketsTable = `
  CREATE TABLE IF NOT EXISTS tickets (
    ticket_number SERIAL PRIMARY KEY,
    transaction_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location TEXT,
    description TEXT,
    due_date DATE NOT NULL,
    amount NUMERIC(10, 1),
    interest NUMERIC(5, 1),
    pickup_amount NUMERIC(10, 1),
    interested_datetime TIMESTAMP DEFAULT NULL,
    employee_name TEXT,
    pickup_datetime TIMESTAMP,
    status TEXT NOT NULL CHECK (status IN ('pawned', 'picked_up', 'expired')),
    customer_number INTEGER REFERENCES customers(customer_number) ON DELETE SET NULL
  );
`;
