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
