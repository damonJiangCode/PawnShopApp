import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculation } from "./calculation.ts";

const utcDate = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

const shortDate = (date: Date) => date.toISOString().slice(0, 10);

const logCase = (
  label: string,
  input: Record<string, unknown>,
  expected: number,
  actual: number,
) => {
  console.log(
    JSON.stringify(
      {
        case: label,
        input,
        expected,
        actual,
      },
      null,
      2,
    ),
  );
};

describe("calculation", () => {
  it("calculates base interest as 30 percent of pawn amount", () => {
    [
      { amount: 100, expected: 30 },
      { amount: 58.9, expected: 17.67 },
    ].forEach(({ amount, expected }) => {
      const actual = calculation.getBaseIntAmt(amount);
      logCase("base interest", { amount }, expected, actual);
      assert.equal(actual, expected);
    });
  });

  it("calculates base pickup as pawn amount plus one interest and one time fee", () => {
    const actual = calculation.getBasePickupAmt(100, 10);
    logCase("base pickup", { amount: 100, oneTimeFee: 10 }, 140, actual);
    assert.equal(actual, 140);
  });

  it("uses early claim amount within 7 days of transaction date", () => {
    const transactionDate = utcDate(2026, 1, 1);
    const asOf = utcDate(2026, 1, 6);
    const actual = calculation.getPaymentPickupAmt(
      100,
      10,
      transactionDate,
      0,
      asOf,
    );

    logCase(
      "early claim",
      {
        amount: 100,
        oneTimeFee: 10,
        transactionDate: shortDate(transactionDate),
        interestPaidMonths: 0,
        asOf: shortDate(asOf),
      },
      120,
      actual,
    );
    assert.equal(actual, 120);
  });

  it("charges one interest month through the first 30 days after transaction", () => {
    const transactionDate = utcDate(2026, 1, 1);
    const asOf = utcDate(2026, 1, 31);
    const actual = calculation.getPaymentPickupAmt(
      100,
      10,
      transactionDate,
      0,
      asOf,
    );

    logCase(
      "first 30 days",
      {
        amount: 100,
        oneTimeFee: 10,
        transactionDate: shortDate(transactionDate),
        interestPaidMonths: 0,
        asOf: shortDate(asOf),
      },
      140,
      actual,
    );
    assert.equal(actual, 140);
  });

  it("charges a second interest month on day 31", () => {
    const transactionDate = utcDate(2026, 1, 1);
    const asOf = utcDate(2026, 2, 1);
    const actual = calculation.getPaymentPickupAmt(
      100,
      10,
      transactionDate,
      0,
      asOf,
    );

    logCase(
      "day 31",
      {
        amount: 100,
        oneTimeFee: 10,
        transactionDate: shortDate(transactionDate),
        interestPaidMonths: 0,
        asOf: shortDate(asOf),
      },
      170,
      actual,
    );
    assert.equal(actual, 170);
  });

  it("subtracts paid interest months from payment pickup amount", () => {
    const transactionDate = utcDate(2026, 1, 1);
    const asOf = utcDate(2026, 2, 1);
    const actual = calculation.getPaymentPickupAmt(
      100,
      10,
      transactionDate,
      1,
      asOf,
    );

    logCase(
      "paid interest month subtracts from pickup",
      {
        amount: 100,
        oneTimeFee: 10,
        transactionDate: shortDate(transactionDate),
        interestPaidMonths: 1,
        asOf: shortDate(asOf),
      },
      140,
      actual,
    );
    assert.equal(actual, 140);
  });

  it("does not reduce pickup below pawn amount plus one time fee", () => {
    const transactionDate = utcDate(2026, 1, 1);
    const asOf = utcDate(2026, 2, 1);
    const actual = calculation.getPaymentPickupAmt(
      100,
      10,
      transactionDate,
      10,
      asOf,
    );

    logCase(
      "minimum pickup floor",
      {
        amount: 100,
        oneTimeFee: 10,
        transactionDate: shortDate(transactionDate),
        interestPaidMonths: 10,
        asOf: shortDate(asOf),
      },
      110,
      actual,
    );
    assert.equal(actual, 110);
  });
});
