import assert from "node:assert/strict";
import test from "node:test";
import { Pool } from "pg";
import { calculation } from "../../../shared/utils/calculation.ts";

test("pickup exceptions reach database writes atomically; normal interest remains unchanged", async (t) => {
  for (const key of ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD"]) {
    process.env[key] ??= "payment_test";
  }
  const calls: { sql: string; values: unknown[] }[] = [];
  let failInterest = false;
  const ticket = (number: number) => ({
    ticket_number: number,
    status: "pawned",
    amount: 100,
    transaction_datetime: new Date("2026-01-01T12:00:00Z"),
    due_date: new Date("2026-01-31T12:00:00Z"),
    client_number: 1,
    interest_paid_months: 0,
  });
  const client = {
    release: () => {},
    query: async (query: string, values: unknown[] = []) => {
      const sql = query.trim();
      calls.push({ sql, values });
      if (sql.includes("FOR UPDATE"))
        return { rows: (values[0] as number[]).map(ticket) };
      if (sql.includes("SUM(amount_paid)")) return { rows: [] };
      if (sql.includes("CURRENT_TIMESTAMP AS current_datetime"))
        return {
          rows: [{ current_datetime: new Date("2026-01-15T12:00:00Z") }],
        };
      if (sql.startsWith("WITH picked"))
        return {
          rows: (values[1] as number[]).map((number, index) => ({
            ...ticket(number),
            status: "pawned_picked_up",
            pickup_amount_paid: (values[2] as number[])[index],
          })),
        };
      if (sql.startsWith("UPDATE ticket"))
        return {
          rows: [
            { ...ticket(Number(values[2])), interest_paid_months: values[0] },
          ],
        };
      if (sql.startsWith("INSERT INTO interest_payment")) {
        if (failInterest) throw new Error("simulated write failure");
        return { rows: [] };
      }
      if (["BEGIN", "COMMIT", "ROLLBACK"].includes(sql)) return { rows: [] };
      throw new Error(`Unexpected test query: ${sql}`);
    },
  };
  t.mock.method(Pool.prototype, "connect", async () => client);
  const { ticketPaymentService } = await import("./ticket-payment.service.ts");
  const input = {
    pickup_ticket_numbers: [101],
    extensions: [
      { ticket_number: 202, months: 2 },
      { ticket_number: 303, months: 1 },
    ],
    pickup_price_exceptions: [{ ticket_number: 101, amount: 90 }],
  };
  const result = await ticketPaymentService.processPayments(input);
  assert.deepEqual(
    calls.find((call) => call.sql.startsWith("WITH picked"))?.values[2],
    [90],
  );
  const inserts = calls.filter((call) =>
    call.sql.startsWith("INSERT INTO interest_payment"),
  );
  assert.deepEqual(
    inserts.map((call) => call.values.slice(0, 3)),
    [
      [202, 2, calculation.getBaseIntAmt(100) * 2],
      [303, 1, calculation.getBaseIntAmt(100)],
    ],
  );
  assert.equal(result.picked_up_tickets[0].pickup_amount_paid, 90);
  assert.equal(calls.at(-1)?.sql, "COMMIT");

  calls.length = 0;
  failInterest = true;
  await assert.rejects(
    ticketPaymentService.processPayments(input),
    /simulated write failure/,
  );
  assert.equal(calls.at(-1)?.sql, "ROLLBACK");
  assert.equal(
    calls.some((call) => call.sql === "COMMIT"),
    false,
  );
});
