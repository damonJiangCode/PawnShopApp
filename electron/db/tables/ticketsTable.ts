export const createTicketsTable = `
  CREATE TABLE IF NOT EXISTS tickets (
    ticket_number SERIAL PRIMARY KEY,
    transaction_datetime TIMESTAMPTZ NOT NULL,
    location TEXT,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    amount NUMERIC(10, 1),
    interest NUMERIC(5, 1),
    pickup_amount NUMERIC(10, 1),
    interested_datetime TIMESTAMPTZ DEFAULT NULL,
    employee_name TEXT,
    pickup_datetime TIMESTAMPTZ DEFAULT NULL,
    status TEXT NOT NULL CHECK (status IN ('pawned', 'picked_up', 'expired')),
    client_number INTEGER REFERENCES clients(client_number) ON DELETE SET NULL
  );
`;
