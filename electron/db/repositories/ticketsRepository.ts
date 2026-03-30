import { connect } from "../tables/createTables.ts";
import type { Ticket } from "../../../shared/types/Ticket.ts";

const mapTicketRow = (row: Record<string, unknown>): Ticket => {
  return {
    ticket_number: Number(row.ticket_number),
    transaction_datetime: new Date(String(row.transaction_datetime)),
    location: row.location ? String(row.location) : "",
    description: row.description ? String(row.description) : "",
    due_date: new Date(String(row.due_date)),
    amount: Number(row.amount ?? 0),
    interest: Number(row.interest ?? 0),
    pickup_amount: Number(row.pickup_amount ?? 0),
    interested_datetime: row.interested_datetime
      ? new Date(String(row.interested_datetime))
      : undefined,
    employee_name: row.employee_name ? String(row.employee_name) : "",
    pickup_datetime: row.pickup_datetime
      ? new Date(String(row.pickup_datetime))
      : undefined,
    status: row.status as Ticket["status"],
    client_number: Number(row.client_number),
  };
};

export const getTickets = async (clientNumber: number): Promise<Ticket[]> => {
  const client = await connect();
  const query = `
    SELECT
      ticket_number,
      transaction_datetime,
      location,
      description,
      due_date,
      amount,
      interest,
      pickup_amount,
      interested_datetime,
      employee_name,
      pickup_datetime,
      status,
      client_number
    FROM tickets
    WHERE client_number = $1
    ORDER BY transaction_datetime DESC, ticket_number DESC
  `;
  try {
    await client.query("BEGIN");
    const result = await client.query(query, [clientNumber]);
    await client.query("COMMIT");
    console.log(clientNumber);
    console.log(result.rows.map(mapTicketRow));
    return result.rows.map(mapTicketRow);
  } catch (error) {
    console.error(
      `[ticketsRepository] ERROR getting tickets for client #${clientNumber}:`,
      error,
    );
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
