import { connect } from "../../database/connection.ts";
import {
  createInterestPaymentIndexes,
  createInterestPaymentTable,
} from "../../database/schema/ticket/interestPaymentTable.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

type AddInterestPaymentPayload = {
  ticket_number: number;
  months_paid: number;
  amount_paid: number;
  payment_datetime: Date;
};

const ensureInterestPaymentTable = async (client: DbClient) => {
  await client.query(createInterestPaymentTable);
  await client.query(createInterestPaymentIndexes);
};

export const interestPaymentRepo = {
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
};
