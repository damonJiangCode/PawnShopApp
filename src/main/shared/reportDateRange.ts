import type { ReportDateRangeInput } from "../../shared/payload-contracts/ticket.contract.ts";
import { createFieldError } from "./createFieldError.ts";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toUtcDate = (dateKey: string) => {
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    return null;
  }

  const date = new Date(`${dateKey}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== dateKey
    ? null
    : date;
};

export const validateReportDateRange = (
  input: ReportDateRangeInput,
  options: { earliestDate?: string; maximumDays?: number } = {},
) => {
  const fromDate = input.from_date?.trim() ?? "";
  const toDate = input.to_date?.trim() ?? "";
  const from = toUtcDate(fromDate);
  const to = toUtcDate(toDate);

  if (!from) {
    throw createFieldError("from_date", "Enter a valid From date.");
  }

  if (!to) {
    throw createFieldError("to_date", "Enter a valid To date.");
  }

  if (from.getTime() > to.getTime()) {
    throw createFieldError(
      "to_date",
      "To date must be the same as or later than From date.",
    );
  }

  if (options.earliestDate && fromDate < options.earliestDate) {
    throw createFieldError(
      "from_date",
      `Reports are available from ${options.earliestDate}.`,
    );
  }

  if (options.maximumDays) {
    const dayCount =
      Math.floor((to.getTime() - from.getTime()) / 86_400_000) + 1;

    if (dayCount > options.maximumDays) {
      throw createFieldError(
        "to_date",
        `Select a range of ${options.maximumDays} days or less.`,
      );
    }
  }

  return { fromDate, toDate };
};
