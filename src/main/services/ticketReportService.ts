import type {
  BuybackReportResult,
  InterestReportResult,
  ReportDateInput,
} from "../../shared/types/ticketApiTypes.ts";
import { ticketReportRepo } from "../repos/ticketReportRepo.ts";
import { createFieldError } from "../utils/createFieldError.ts";
import { ticketInput } from "./inputs/ticketInput.ts";

export const ticketReportService = {
  loadBuybackReport: async (
    input: ReportDateInput,
  ): Promise<BuybackReportResult> => {
    const normalizedInput = ticketInput.normalizeReportDate(input);

    if (!ticketInput.isValidDateKey(normalizedInput.date)) {
      throw createFieldError("date", "Enter a valid report date.");
    }

    const sourceRows = await ticketReportRepo.loadBuybackReportRows(
      normalizedInput.date,
    );

    const rows = sourceRows.map((row) => ({
      ticket_number: row.ticket_number,
      pickup_datetime: row.pickup_datetime,
      pickup_amount_paid: Number(row.pickup_amount_paid.toFixed(2)),
      description: row.description,
      client_name: row.client_name,
    }));

    const total = rows.reduce((sum, row) => sum + row.pickup_amount_paid, 0);

    return {
      date: normalizedInput.date,
      rows,
      total_buyback_price: Number(total.toFixed(2)),
    };
  },

  loadInterestReport: async (
    input: ReportDateInput,
  ): Promise<InterestReportResult> => {
    const normalizedInput = ticketInput.normalizeReportDate(input);

    if (!ticketInput.isValidDateKey(normalizedInput.date)) {
      throw createFieldError("date", "Enter a valid report date.");
    }

    const rows = await ticketReportRepo.loadInterestReportRows(
      normalizedInput.date,
    );
    const total = rows.reduce((sum, row) => sum + row.amount_paid, 0);

    return {
      date: normalizedInput.date,
      rows,
      total_interest_paid: Number(total.toFixed(2)),
    };
  },
};
