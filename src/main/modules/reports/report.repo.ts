import { connect } from "../../database/connection.ts";

export type BuybackReportSourceRow = {
  ticket_number: number;
  pickup_datetime: Date;
  pickup_amount_paid: number;
  transaction_datetime: Date;
  amount: number;
  onetime_fee: number;
  interest_paid_months: number;
  partial_payment: number;
  description: string;
  client_name: string;
};

export type InterestReportRow = {
  ticket_number: number;
  months_paid: number;
  amount_paid: number;
  description: string;
  client_name: string;
  payment_datetime: Date;
};

const clientDisplayNameSql = (alias: string) => `
  CONCAT(
    UPPER(${alias}.last_name),
    ', ',
    UPPER(${alias}.first_name),
    CASE
      WHEN COALESCE(TRIM(${alias}.middle_name), '') = '' THEN ''
      ELSE CONCAT(' ', UPPER(${alias}.middle_name))
    END
  )
`;

const mapBuybackReportRow = (
  row: Record<string, unknown>,
): BuybackReportSourceRow => ({
  ticket_number: Number(row.ticket_number),
  pickup_datetime: new Date(String(row.pickup_datetime)),
  pickup_amount_paid: Number(row.pickup_amount_paid ?? 0),
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

export const reportRepo = {
  loadBuybackReportRows: async (
    dateKey: string,
  ): Promise<BuybackReportSourceRow[]> => {
    const client = await connect();
    const query = `
      SELECT
        t.ticket_number,
        t.pickup_datetime,
        t.pickup_amount_paid,
        t.amount,
        t.onetime_fee,
        t.transaction_datetime,
        t.interest_paid_months,
        t.partial_payment,
        t.description,
        ${clientDisplayNameSql("c")} AS client_name
      FROM ticket t
      LEFT JOIN client c ON c.client_number = t.client_number
      WHERE t.status = 'pawned_picked_up'
        AND t.pickup_datetime >= $1::date
        AND t.pickup_datetime < ($1::date + INTERVAL '1 day')
      ORDER BY t.pickup_datetime ASC, t.ticket_number ASC
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
        ${clientDisplayNameSql("c")} AS client_name
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
};
