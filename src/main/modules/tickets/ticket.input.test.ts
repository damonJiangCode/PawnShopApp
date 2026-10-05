import assert from "node:assert/strict";
import test from "node:test";
import { ticketInput } from "./ticket.input.ts";

test("normalizes payment tickets and combines repeated extensions", () => {
  assert.deepEqual(
    ticketInput.normalizeProcessPayments({
      pickup_ticket_numbers: [101, 101, 0, Number.NaN],
      extensions: [
        { ticket_number: 202, months: 1 },
        { ticket_number: 202, months: 2 },
        { ticket_number: 303, months: 0 },
      ],
    }),
    {
      pickup_ticket_numbers: [101],
      extensions: [{ ticket_number: 202, months: 3 }],
    },
  );
});

import type { ProcessTicketPaymentsInput } from "../../../shared/payload-contracts/ticket.contract.ts";

const payment: ProcessTicketPaymentsInput = {
  pickup_ticket_numbers: [101, 303],
  extensions: [{ ticket_number: 202, months: 2 }],
};

test("normal payments need no exception; zero and cent amounts are accepted", () => {
  assert.equal(ticketInput.validatePickupPriceExceptions(payment).size, 0);
  assert.deepEqual(
    [
      ...ticketInput.validatePickupPriceExceptions({
        ...payment,
        pickup_price_exceptions: [
          { ticket_number: 101, amount: 0 },
          { ticket_number: 303, amount: 12.34 },
        ],
      }),
    ],
    [
      [101, 0],
      [303, 12.34],
    ],
  );
});

test("invalid amounts, unmatched tickets, interest-only tickets and duplicate exceptions are rejected", () => {
  for (const amount of [-1, NaN, Infinity, 1.001, 100000000, "", null]) {
    assert.throws(() =>
      ticketInput.validatePickupPriceExceptions({
        ...payment,
        pickup_price_exceptions: [
          { ticket_number: 101, amount: amount as number },
        ],
      }),
    );
  }
  for (const exception of [
    { ticket_number: 999, amount: 10 },
    { ticket_number: 202, amount: 10 },
  ]) {
    assert.throws(() =>
      ticketInput.validatePickupPriceExceptions({
        ...payment,
        pickup_price_exceptions: [exception],
      }),
    );
  }
  const duplicate = { ticket_number: 101, amount: 10 };
  assert.throws(() =>
    ticketInput.validatePickupPriceExceptions({
      ...payment,
      pickup_price_exceptions: [duplicate, duplicate],
    }),
  );
});
