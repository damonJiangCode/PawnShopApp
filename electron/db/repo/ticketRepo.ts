import { connect } from "../table/createTable.ts";
import type { Ticket } from "../../../shared/types/Ticket.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

type AddTicketPayload = {
  transaction_datetime: Date;
  location: string;
  description: string;
  due_date: Date;
  is_overdue: boolean;
  amount: number;
  onetime_fee: number;
  interest: number;
  pickup_amount: number;
  employee_name: string;
  status: Ticket["status"];
  client_number: number;
};

type UpdateTicketPayload = {
  ticket_number: number;
  location: string;
  description: string;
  amount: number;
  onetime_fee: number;
  interest: number;
  pickup_amount: number;
  employee_name: string;
};

const mapTicketRow = (row: Record<string, unknown>): Ticket => {
  return {
    ticket_number: Number(row.ticket_number),
    transaction_datetime: new Date(String(row.transaction_datetime)),
    location: row.location ? String(row.location) : "",
    description: row.description ? String(row.description) : "",
    due_date: new Date(String(row.due_date)),
    is_overdue: Boolean(row.is_overdue),
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
        is_overdue,
        amount,
        onetime_fee,
        interest,
        pickup_amount,
        interested_datetime,
        employee_name,
        pickup_datetime,
        status,
        client_number
      FROM ticket
      WHERE client_number = $1
      ORDER BY transaction_datetime DESC, ticket_number DESC
    `;

    try {
      const result = await client.query(query, [clientNumber]);
      return result.rows.map(mapTicketRow);
    } finally {
      client.release();
    }
  },

  getEmployeeName: async (
    employeePassword: string,
    dbClient?: DbClient,
  ): Promise<string | null> => {
    const client = dbClient ?? (await connect());
    const query = `
      SELECT first_name, last_name
      FROM employee
      WHERE password = $1
      LIMIT 1
    `;

    try {
      const result = await client.query(query, [employeePassword]);
      const employee = result.rows[0];

      if (!employee) {
        console.warn("[ticketRepo] getEmployeeName: No employee found");
        return null;
      }

      return employee.first_name;
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  addTicket: async (
    payload: AddTicketPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      INSERT INTO ticket (
        transaction_datetime,
        location,
        description,
        due_date,
        is_overdue,
        amount,
        onetime_fee,
        interest,
        pickup_amount,
        employee_name,
        status,
        client_number
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      RETURNING
        ticket_number,
        transaction_datetime,
        location,
        description,
        due_date,
        is_overdue,
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
      payload.is_overdue,
      payload.amount,
      payload.onetime_fee,
      payload.interest,
      payload.pickup_amount,
      payload.employee_name,
      payload.status,
      payload.client_number,
    ];

    try {
      const result = await client.query(query, values);
      return mapTicketRow(result.rows[0]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  updateTicket: async (
    payload: UpdateTicketPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      UPDATE ticket
      SET
        location = $1,
        description = $2,
        is_overdue = COALESCE(due_date < NOW(), FALSE),
        amount = $3,
        onetime_fee = $4,
        interest = $5,
        pickup_amount = $6,
        employee_name = $7
      WHERE ticket_number = $8
      RETURNING
        ticket_number,
        transaction_datetime,
        location,
        description,
        due_date,
        is_overdue,
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
      payload.location,
      payload.description,
      payload.amount,
      payload.onetime_fee,
      payload.interest,
      payload.pickup_amount,
      payload.employee_name,
      payload.ticket_number,
    ];

    try {
      const result = await client.query(query, values);

      if (!result.rows[0]) {
        throw new Error(
          `[ticketRepo] updateTicket(): Ticket #${payload.ticket_number} not found`,
        );
      }

      return mapTicketRow(result.rows[0]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },
};
