import { connect } from "../tables/createTables.ts";
import type { Ticket } from "../../../shared/types/Ticket.ts";

type AddTicketPayload = {
  transaction_datetime: Date;
  location: string;
  description: string;
  due_date: Date;
  amount: number;
  onetime_fee: number;
  interest: number;
  pickup_amount: number;
  employee_name: string;
  status: Ticket["status"];
  client_number: number;
};

const mapTicketRow = (row: Record<string, unknown>): Ticket => {
  return {
    ticket_number: Number(row.ticket_number),
    transaction_datetime: new Date(String(row.transaction_datetime)),
    location: row.location ? String(row.location) : "",
    description: row.description ? String(row.description) : "",
    due_date: new Date(String(row.due_date)),
    amount: Number(row.amount ?? 0),
    onetime_fee: Number(row.onetime_fee ?? 0),
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

export const ticketRepo = {
  getTickets: async (clientNumber: number): Promise<Ticket[]> => {
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
      return result.rows.map(mapTicketRow);
    } catch (error) {
      console.error(
        `[ticketRepo] ERROR getting tickets for client #${clientNumber}:`,
        error,
      );
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  getEmployeeName: async (employeePassword: string): Promise<string | null> => {
    const client = await connect();
    const query = `
      SELECT first_name, last_name
      FROM employees
      WHERE password = $1
      LIMIT 1
    `;

    try {
      await client.query("BEGIN");
      const result = await client.query(query, [employeePassword]);
      await client.query("COMMIT");
      const employee = result.rows[0];

      if (!employee) {
        console.warn("[ticketRepo] getEmployeeName: No employee found");
        return null;
      }

      return employee.first_name;
    } catch (err) {
      console.error(
        "[ticketRepo.ts] getEmployeeName(): getting employee name, ",
        err,
      );
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  addTicket: async (payload: AddTicketPayload): Promise<Ticket> => {
    const client = await connect();
    const query = `
      INSERT INTO tickets (
        transaction_datetime,
        location,
        description,
        due_date,
        amount,
        onetime_fee,
        interest,
        pickup_amount,
        employee_name,
        status,
        client_number
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      RETURNING
        ticket_number,
        transaction_datetime,
        location,
        description,
        due_date,
        amount,
        onetime_fee,
        interest,
        pickup_amount,
        interested_datetime,
        employee_name,
        pickup_datetime,
        status,
        client_number
    `;

    const values = [
      payload.transaction_datetime,
      payload.location,
      payload.description,
      payload.due_date,
      payload.amount,
      payload.onetime_fee,
      payload.interest,
      payload.pickup_amount,
      payload.employee_name,
      payload.status,
      payload.client_number,
    ];

    try {
      await client.query("BEGIN");
      const result = await client.query(query, values);
      await client.query("COMMIT");
      return mapTicketRow(result.rows[0]);
    } catch (error) {
      console.error("[ticketRepo] ERROR adding ticket:", error);
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
