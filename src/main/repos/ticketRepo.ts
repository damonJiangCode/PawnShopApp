import { connect } from "../../db/connection.ts";
import type { TransferTicketPreview } from "../../shared/ipc/ticketTypes.ts";
import type { Ticket } from "../../shared/types/Ticket.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

type AddTicketPayload = {
  transaction_datetime: Date;
  is_lost: boolean;
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
  is_lost: boolean;
  location: string;
  description: string;
  amount: number;
  onetime_fee: number;
  interest: number;
  pickup_amount: number;
  employee_name: string;
};

type ConvertTicketPayload = {
  ticket_number: number;
  status: Ticket["status"];
  description: string;
  location: string;
  amount: number;
  due_date: Date;
  is_overdue: boolean;
  onetime_fee: number;
  interest: number;
  pickup_amount: number;
  employee_name: string;
};

type ExpireTicketPayload = {
  ticket_number: number;
  status: Ticket["status"];
};

const mapTransferTicketPreviewRow = (
  row: Record<string, unknown>,
): TransferTicketPreview => ({
  ticket_number: Number(row.ticket_number),
  status: row.status as Ticket["status"],
  description: row.description ? String(row.description) : "",
  location: row.location ? String(row.location) : "",
  amount: Number(row.amount ?? 0),
  previous_client_number: Number(row.previous_client_number),
  previous_client_name: row.previous_client_name
    ? String(row.previous_client_name)
    : "",
});

const mapTicketRow = (row: Record<string, unknown>): Ticket => {
  return {
    ticket_number: Number(row.ticket_number),
    transaction_datetime: new Date(String(row.transaction_datetime)),
    is_lost: Boolean(row.is_lost),
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
  loadByClientNumber: async (clientNumber: number): Promise<Ticket[]> => {
    const client = await connect();
    const query = `
      SELECT
        ticket_number,
        transaction_datetime,
        is_lost,
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
      ORDER BY transaction_datetime ASC, ticket_number ASC
    `;

    try {
      const result = await client.query(query, [clientNumber]);
      return result.rows.map(mapTicketRow);
    } finally {
      client.release();
    }
  },

  loadByTicketNumber: async (
    ticketNumber: number,
    dbClient?: DbClient,
  ): Promise<Ticket | null> => {
    const client = dbClient ?? (await connect());
    const query = `
      SELECT
        ticket_number,
        transaction_datetime,
        is_lost,
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
      WHERE ticket_number = $1
      LIMIT 1
    `;

    try {
      const result = await client.query(query, [ticketNumber]);
      return result.rows[0] ? mapTicketRow(result.rows[0]) : null;
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  loadLocations: async (): Promise<string[]> => {
    const client = await connect();
    const query = "SELECT location FROM location ORDER BY location ASC";

    try {
      const result = await client.query(query);
      return result.rows.map((row) => row.location);
    } finally {
      client.release();
    }
  },

  loadTransferTicketPreview: async (
    ticketNumber: number,
  ): Promise<TransferTicketPreview | null> => {
    const client = await connect();
    const query = `
      SELECT
        t.ticket_number,
        t.status,
        t.description,
        t.location,
        t.amount,
        t.client_number AS previous_client_number,
        CONCAT(
          UPPER(c.last_name),
          ', ',
          UPPER(c.first_name),
          CASE
            WHEN COALESCE(TRIM(c.middle_name), '') = '' THEN ''
            ELSE CONCAT(' ', UPPER(c.middle_name))
          END
        ) AS previous_client_name
      FROM ticket t
      INNER JOIN client c ON c.client_number = t.client_number
      WHERE t.ticket_number = $1
      LIMIT 1
    `;

    try {
      const result = await client.query(query, [ticketNumber]);
      return result.rows[0] ? mapTransferTicketPreviewRow(result.rows[0]) : null;
    } finally {
      client.release();
    }
  },

  create: async (
    payload: AddTicketPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      INSERT INTO ticket (
        transaction_datetime,
        is_lost,
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
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING
        ticket_number,
        transaction_datetime,
        is_lost,
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
      payload.is_lost,
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

  update: async (
    payload: UpdateTicketPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      UPDATE ticket
      SET
        is_lost = $1,
        location = $2,
        description = $3,
        is_overdue = COALESCE(due_date < NOW(), FALSE),
        amount = $4,
        onetime_fee = $5,
        interest = $6,
        pickup_amount = $7,
        employee_name = $8
      WHERE ticket_number = $9
      RETURNING
        ticket_number,
        transaction_datetime,
        is_lost,
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
      payload.is_lost,
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

  convert: async (
    payload: ConvertTicketPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      UPDATE ticket
      SET
        status = $1,
        description = $2,
        location = $3,
        amount = $4,
        due_date = $5,
        is_overdue = $6,
        onetime_fee = $7,
        interest = $8,
        pickup_amount = $9,
        employee_name = $10
      WHERE ticket_number = $11
      RETURNING
        ticket_number,
        transaction_datetime,
        is_lost,
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
      payload.status,
      payload.description,
      payload.location,
      payload.amount,
      payload.due_date,
      payload.is_overdue,
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
          `[ticketRepo] convert(): Ticket #${payload.ticket_number} not found`,
        );
      }

      return mapTicketRow(result.rows[0]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  expire: async (
    payload: ExpireTicketPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      UPDATE ticket
      SET status = $1
      WHERE ticket_number = $2
      RETURNING
        ticket_number,
        transaction_datetime,
        is_lost,
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

    try {
      const result = await client.query(query, [
        payload.status,
        payload.ticket_number,
      ]);

      if (!result.rows[0]) {
        throw new Error(
          `[ticketRepo] expire(): Ticket #${payload.ticket_number} not found`,
        );
      }

      return mapTicketRow(result.rows[0]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  transfer: async (
    ticketNumber: number,
    clientNumber: number,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      UPDATE ticket
      SET client_number = $1
      WHERE ticket_number = $2
      RETURNING
        ticket_number,
        transaction_datetime,
        is_lost,
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

    try {
      const result = await client.query(query, [clientNumber, ticketNumber]);

      if (!result.rows[0]) {
        throw new Error(
          `[ticketRepo] transfer(): Ticket #${ticketNumber} not found`,
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
