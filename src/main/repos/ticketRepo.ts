import { connect } from "../../db/connection.ts";
import {
  createInterestPaymentIndexes,
  createInterestPaymentTable,
} from "../../db/schema/ticket/interestPaymentTable.ts";
import type {
  HolidayDate,
  SaveHolidayInput,
} from "../../shared/types/holidayDate.ts";
import type {
  Location,
  SaveLocationInput,
} from "../../shared/types/location.ts";
import type { TransferTicketPreview } from "../../shared/types/ticketPayload.ts";
import type { Ticket } from "../../shared/types/Ticket.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

type AddTicketPayload = {
  transaction_datetime: Date;
  is_lost: boolean;
  location: string;
  description: string;
  due_date: Date;
  amount: number;
  onetime_fee: number;
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
  partial_payment: number;
  employee_name: string;
};

type ConvertTicketPayload = {
  ticket_number: number;
  status: Ticket["status"];
  description: string;
  location: string;
  amount: number;
  due_date: Date;
  onetime_fee: number;
  employee_name: string;
};

type ExpireTicketPayload = {
  ticket_number: number;
  current_status: Ticket["status"];
  current_due_date: Date;
  status: Ticket["status"];
};

type MarkTicketStolenPayload = {
  ticket_number: number;
};

type PickupTicketsPayload = {
  ticket_numbers: number[];
  pickup_datetime: Date;
};

type ExtendTicketPayload = {
  ticket_number: number;
  months: number;
  interested_datetime: Date;
};

type AddInterestPaymentPayload = {
  ticket_number: number;
  months_paid: number;
  amount_paid: number;
  payment_datetime: Date;
};

type BuybackReportSourceRow = {
  ticket_number: number;
  pickup_datetime: Date;
  transaction_datetime: Date;
  amount: number;
  onetime_fee: number;
  interest_paid_months: number;
  partial_payment: number;
  description: string;
  client_name: string;
};

type InterestReportRow = {
  ticket_number: number;
  months_paid: number;
  amount_paid: number;
  description: string;
  client_name: string;
  payment_datetime: Date;
};

const ticketSelectColumns = `
  ticket_number,
  transaction_datetime,
  is_lost,
  is_stolen,
  location,
  description,
  due_date,
  amount,
  onetime_fee,
  interest_paid_months,
  partial_payment,
  partial_payment_datetime,
  interested_datetime,
  employee_name,
  pickup_datetime,
  expire_date,
  status,
  status_updated_at,
  client_number
`;

const ensureInterestPaymentTable = async (client: DbClient) => {
  await client.query(createInterestPaymentTable);
  await client.query(createInterestPaymentIndexes);
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

const mapBuybackReportRow = (
  row: Record<string, unknown>,
): BuybackReportSourceRow => ({
  ticket_number: Number(row.ticket_number),
  pickup_datetime: new Date(String(row.pickup_datetime)),
  transaction_datetime: new Date(String(row.transaction_datetime)),
  amount: Number(row.amount ?? 0),
  onetime_fee: Number(row.onetime_fee ?? 0),
  interest_paid_months: Number(row.interest_paid_months ?? 0),
  partial_payment: Number(row.partial_payment ?? 0),
  description: row.description ? String(row.description) : "",
  client_name: row.client_name ? String(row.client_name) : "",
});

const mapInterestReportRow = (
  row: Record<string, unknown>,
): InterestReportRow => ({
  ticket_number: Number(row.ticket_number),
  months_paid: Number(row.months_paid ?? 0),
  amount_paid: Number(row.amount_paid ?? 0),
  description: row.description ? String(row.description) : "",
  client_name: row.client_name ? String(row.client_name) : "",
  payment_datetime: new Date(String(row.payment_datetime)),
});

const mapTicketRow = (row: Record<string, unknown>): Ticket => {
  return {
    ticket_number: Number(row.ticket_number),
    transaction_datetime: new Date(String(row.transaction_datetime)),
    is_lost: Boolean(row.is_lost),
    is_stolen: Boolean(row.is_stolen),
    location: row.location ? String(row.location) : "",
    description: row.description ? String(row.description) : "",
    due_date: new Date(String(row.due_date)),
    amount: Number(row.amount ?? 0),
    onetime_fee: Number(row.onetime_fee ?? 0),
    interest_paid_months: Number(row.interest_paid_months ?? 0),
    partial_payment: Number(row.partial_payment ?? 0),
    partial_payment_datetime: row.partial_payment_datetime
      ? new Date(String(row.partial_payment_datetime))
      : undefined,
    interested_datetime: row.interested_datetime
      ? new Date(String(row.interested_datetime))
      : undefined,
    employee_name: row.employee_name ? String(row.employee_name) : "",
    pickup_datetime: row.pickup_datetime
      ? new Date(String(row.pickup_datetime))
      : undefined,
    expire_date: row.expire_date
      ? new Date(String(row.expire_date))
      : undefined,
    status: row.status as Ticket["status"],
    status_updated_at: row.status_updated_at
      ? new Date(String(row.status_updated_at))
      : new Date(String(row.transaction_datetime)),
    client_number: Number(row.client_number),
  };
};

export const ticketRepo = {
  loadByClientNumber: async (clientNumber: number): Promise<Ticket[]> => {
    const client = await connect();
    const query = `
      SELECT ${ticketSelectColumns}
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
      SELECT ${ticketSelectColumns}
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

  loadBuybackReportRows: async (
    dateKey: string,
  ): Promise<BuybackReportSourceRow[]> => {
    const client = await connect();
    const query = `
      SELECT
        t.ticket_number,
        t.pickup_datetime,
        t.amount,
        t.onetime_fee,
        t.transaction_datetime,
        t.interest_paid_months,
        t.partial_payment,
        t.description,
        CONCAT(
          UPPER(c.last_name),
          ', ',
          UPPER(c.first_name),
          CASE
            WHEN COALESCE(TRIM(c.middle_name), '') = '' THEN ''
            ELSE CONCAT(' ', UPPER(c.middle_name))
          END
        ) AS client_name
      FROM ticket t
      LEFT JOIN client c ON c.client_number = t.client_number
      WHERE t.status = 'picked_up'
        AND t.pickup_datetime >= $1::date
        AND t.pickup_datetime < ($1::date + INTERVAL '1 day')
      ORDER BY t.ticket_number ASC
    `;

    try {
      const result = await client.query(query, [dateKey]);
      return result.rows.map(mapBuybackReportRow);
    } finally {
      client.release();
    }
  },

  loadInterestReportRows: async (
    dateKey: string,
  ): Promise<InterestReportRow[]> => {
    const client = await connect();
    const query = `
      SELECT
        ip.ticket_number,
        ip.months_paid,
        ip.amount_paid,
        ip.payment_datetime,
        t.description,
        CONCAT(
          UPPER(c.last_name),
          ', ',
          UPPER(c.first_name),
          CASE
            WHEN COALESCE(TRIM(c.middle_name), '') = '' THEN ''
            ELSE CONCAT(' ', UPPER(c.middle_name))
          END
        ) AS client_name
      FROM interest_payment ip
      INNER JOIN ticket t ON t.ticket_number = ip.ticket_number
      LEFT JOIN client c ON c.client_number = t.client_number
      WHERE ip.payment_datetime >= $1::date
        AND ip.payment_datetime < ($1::date + INTERVAL '1 day')
      ORDER BY ip.payment_datetime ASC, ip.ticket_number ASC
    `;

    try {
      const result = await client.query(query, [dateKey]);
      return result.rows.map(mapInterestReportRow);
    } finally {
      client.release();
    }
  },

  loadLocations: async (): Promise<string[]> => {
    const client = await connect();
    const query = `
      SELECT location
      FROM location
      WHERE is_active = TRUE
      ORDER BY location ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => row.location);
    } finally {
      client.release();
    }
  },

  loadAdminLocations: async (): Promise<Location[]> => {
    const client = await connect();
    const query = `
      SELECT location, description, is_active
      FROM location
      ORDER BY is_active DESC, location ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => ({
        location: String(row.location),
        description: String(row.description ?? ""),
        is_active: Boolean(row.is_active),
      }));
    } finally {
      client.release();
    }
  },

  addLocation: async (input: SaveLocationInput): Promise<Location | null> => {
    const client = await connect();
    const query = `
      INSERT INTO location (location, description, is_active)
      VALUES ($1, $2, TRUE)
      ON CONFLICT (location) DO NOTHING
      RETURNING location, description, is_active
    `;

    try {
      const result = await client.query(query, [
        input.location,
        input.description,
      ]);
      const row = result.rows[0];

      return row
        ? {
            location: String(row.location),
            description: String(row.description ?? ""),
            is_active: Boolean(row.is_active),
          }
        : null;
    } finally {
      client.release();
    }
  },

  deactivateLocation: async (location: string): Promise<Location | null> => {
    const client = await connect();
    const query = `
      UPDATE location
      SET is_active = FALSE
      WHERE location = $1 AND is_active = TRUE
      RETURNING location, description, is_active
    `;

    try {
      const result = await client.query(query, [location]);
      const row = result.rows[0];

      return row
        ? {
            location: String(row.location),
            description: String(row.description ?? ""),
            is_active: Boolean(row.is_active),
          }
        : null;
    } finally {
      client.release();
    }
  },

  loadHolidayDates: async (): Promise<HolidayDate[]> => {
    const client = await connect();
    const query = `
      SELECT
        holiday_date::text AS holiday_date,
        name
      FROM holiday_date
      ORDER BY holiday_date ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => ({
        holiday_date: String(row.holiday_date),
        name: String(row.name),
      }));
    } finally {
      client.release();
    }
  },

  addHolidayDate: async (
    input: SaveHolidayInput,
  ): Promise<HolidayDate | null> => {
    const client = await connect();
    const query = `
      INSERT INTO holiday_date (holiday_date, name)
      VALUES ($1, $2)
      ON CONFLICT (holiday_date) DO NOTHING
      RETURNING holiday_date::text AS holiday_date, name
    `;

    try {
      const result = await client.query(query, [
        input.holiday_date,
        input.name,
      ]);
      const row = result.rows[0];

      return row
        ? {
            holiday_date: String(row.holiday_date),
            name: String(row.name),
          }
        : null;
    } finally {
      client.release();
    }
  },

  deleteHolidayDate: async (
    holidayDate: string,
  ): Promise<HolidayDate | null> => {
    const client = await connect();
    const query = `
      DELETE FROM holiday_date
      WHERE holiday_date = $1
      RETURNING holiday_date::text AS holiday_date, name
    `;

    try {
      const result = await client.query(query, [holidayDate]);
      const row = result.rows[0];

      return row
        ? {
            holiday_date: String(row.holiday_date),
            name: String(row.name),
          }
        : null;
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
      return result.rows[0]
        ? mapTransferTicketPreviewRow(result.rows[0])
        : null;
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
        amount,
        onetime_fee,
        employee_name,
        status,
        client_number
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      RETURNING ${ticketSelectColumns}
    `;

    const values = [
      payload.transaction_datetime,
      payload.is_lost,
      payload.location,
      payload.description,
      payload.due_date,
      payload.amount,
      payload.onetime_fee,
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
        amount = $4,
        onetime_fee = $5,
        partial_payment = $6,
        partial_payment_datetime = CASE
          WHEN $6 IS DISTINCT FROM partial_payment THEN CURRENT_TIMESTAMP
          ELSE partial_payment_datetime
        END,
        employee_name = $7
      WHERE ticket_number = $8
      RETURNING ${ticketSelectColumns}
    `;

    const values = [
      payload.is_lost,
      payload.location,
      payload.description,
      payload.amount,
      payload.onetime_fee,
      payload.partial_payment,
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
        onetime_fee = $6,
        employee_name = $7
      WHERE ticket_number = $8
      RETURNING ${ticketSelectColumns}
    `;

    const values = [
      payload.status,
      payload.description,
      payload.location,
      payload.amount,
      payload.due_date,
      payload.onetime_fee,
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
      SET
        status = $1,
        expire_date = CURRENT_TIMESTAMP,
        status_updated_at = CURRENT_TIMESTAMP
      WHERE ticket_number = $2
        AND status = $3
        AND due_date = $4
      RETURNING ${ticketSelectColumns}
    `;

    try {
      const result = await client.query(query, [
        payload.status,
        payload.ticket_number,
        payload.current_status,
        payload.current_due_date,
      ]);

      if (!result.rows[0]) {
        throw new Error(
          `[ticketRepo] expire(): Ticket #${payload.ticket_number} was changed before it could be expired`,
        );
      }

      return mapTicketRow(result.rows[0]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  pickup: async (
    payload: PickupTicketsPayload,
    dbClient?: DbClient,
  ): Promise<Ticket[]> => {
    const client = dbClient ?? (await connect());
    const query = `
      WITH picked AS (
        UPDATE ticket
        SET
          status = 'picked_up',
          pickup_datetime = $1,
          status_updated_at = $1
        WHERE ticket_number = ANY($2::int[])
          AND status = 'pawned'
        RETURNING ${ticketSelectColumns}
      ),
      client_counts AS (
        SELECT client_number, COUNT(*)::int AS picked_count
        FROM picked
        GROUP BY client_number
      ),
      updated_clients AS (
        UPDATE client c
        SET
          redeem_count = COALESCE(c.redeem_count, 0) + cc.picked_count,
          updated_at = CURRENT_TIMESTAMP
        FROM client_counts cc
        WHERE c.client_number = cc.client_number
        RETURNING c.client_number
      )
      SELECT ${ticketSelectColumns}
      FROM picked
      ORDER BY ticket_number ASC
    `;

    try {
      const result = await client.query(query, [
        payload.pickup_datetime,
        payload.ticket_numbers,
      ]);
      return result.rows.map(mapTicketRow);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  extend: async (
    payload: ExtendTicketPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      UPDATE ticket
      SET
        due_date = due_date + ($1 * INTERVAL '30 days'),
        interest_paid_months = interest_paid_months + $1,
        interested_datetime = $2
      WHERE ticket_number = $3
        AND status = 'pawned'
      RETURNING ${ticketSelectColumns}
    `;

    try {
      const result = await client.query(query, [
        payload.months,
        payload.interested_datetime,
        payload.ticket_number,
      ]);

      if (!result.rows[0]) {
        throw new Error(
          `[ticketRepo] extend(): Ticket #${payload.ticket_number} not found`,
        );
      }

      return mapTicketRow(result.rows[0]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  addInterestPayment: async (
    payload: AddInterestPaymentPayload,
    dbClient?: DbClient,
  ): Promise<void> => {
    const client = dbClient ?? (await connect());
    const query = `
      INSERT INTO interest_payment (
        ticket_number,
        months_paid,
        amount_paid,
        payment_datetime
      ) VALUES ($1, $2, $3, $4)
    `;

    try {
      await ensureInterestPaymentTable(client);
      await client.query(query, [
        payload.ticket_number,
        payload.months_paid,
        payload.amount_paid,
        payload.payment_datetime,
      ]);
    } finally {
      if (!dbClient) {
        client.release();
      }
    }
  },

  markStolen: async (
    payload: MarkTicketStolenPayload,
    dbClient?: DbClient,
  ): Promise<Ticket> => {
    const client = dbClient ?? (await connect());
    const query = `
      UPDATE ticket
      SET is_stolen = TRUE
      WHERE ticket_number = $1
      RETURNING ${ticketSelectColumns}
    `;

    try {
      const result = await client.query(query, [payload.ticket_number]);

      if (!result.rows[0]) {
        throw new Error(
          `[ticketRepo] markStolen(): Ticket #${payload.ticket_number} not found`,
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
      RETURNING ${ticketSelectColumns}
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
