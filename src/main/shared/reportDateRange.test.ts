import assert from "node:assert/strict";
import test from "node:test";
import { extractFieldError } from "./createFieldError.ts";
import { validateReportDateRange } from "./reportDateRange.ts";

const getFieldError = (callback: () => unknown) => {
  try {
    callback();
  } catch (error) {
    return extractFieldError(error);
  }

  return null;
};

test("accepts an inclusive report date range at the maximum length", () => {
  assert.deepEqual(
    validateReportDateRange(
      { from_date: "2026-01-01", to_date: "2026-04-03" },
      { maximumDays: 93 },
    ),
    { fromDate: "2026-01-01", toDate: "2026-04-03" },
  );
});

test("rejects invalid and reversed report dates as field errors", () => {
  assert.deepEqual(
    getFieldError(() =>
      validateReportDateRange({
        from_date: "2026-02-30",
        to_date: "2026-03-01",
      }),
    ),
    { field: "from_date", message: "Enter a valid From date." },
  );

  assert.deepEqual(
    getFieldError(() =>
      validateReportDateRange({
        from_date: "2026-03-02",
        to_date: "2026-03-01",
      }),
    ),
    {
      field: "to_date",
      message: "To date must be the same as or later than From date.",
    },
  );
});

test("enforces report availability and maximum range limits", () => {
  assert.deepEqual(
    getFieldError(() =>
      validateReportDateRange(
        { from_date: "2026-01-01", to_date: "2026-01-02" },
        { earliestDate: "2026-01-02" },
      ),
    ),
    {
      field: "from_date",
      message: "Reports are available from 2026-01-02.",
    },
  );

  assert.deepEqual(
    getFieldError(() =>
      validateReportDateRange(
        { from_date: "2026-01-01", to_date: "2026-04-04" },
        { maximumDays: 93 },
      ),
    ),
    { field: "to_date", message: "Select a range of 93 days or less." },
  );
});
