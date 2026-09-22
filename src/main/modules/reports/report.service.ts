import type {
  BuybackReportResult,
  DailyReportResult,
  DailyReportTicket,
  InterestReportResult,
  ReportDateInput,
  ReportDateRangeInput,
} from "../../../shared/payload-contracts/ticket.contract.ts";
import { reportRepo } from "./report.repo.ts";
import { createFieldError } from "../../shared/createFieldError.ts";
import { ticketInput } from "../tickets/ticket.input.ts";

export const reportService = {
  loadDailyReport: async (
    input: ReportDateRangeInput,
  ): Promise<DailyReportResult> => {
    const fromDate = input.from_date?.trim() ?? "";
    const toDate = input.to_date?.trim() ?? "";

    if (!ticketInput.isValidDateKey(fromDate)) {
      throw createFieldError("from_date", "Enter a valid From date.");
    }

    if (!ticketInput.isValidDateKey(toDate)) {
      throw createFieldError("to_date", "Enter a valid To date.");
    }

    if (fromDate > toDate) {
      throw createFieldError(
        "to_date",
        "To date must be the same as or later than From date.",
      );
    }

    const sourceRows = await reportRepo.loadDailyReportRows(fromDate, toDate);
    const ticketMap = new Map<number, DailyReportTicket>();

    for (const row of sourceRows) {
      let ticket = ticketMap.get(row.ticket_number);

      if (!ticket) {
        ticket = {
          ticket_number: row.ticket_number,
          amount: row.ticket_amount,
          description: row.ticket_description,
          client_name: row.client_name,
          date_of_birth: row.date_of_birth,
          gender: row.gender,
          hair_color: row.hair_color,
          eye_color: row.eye_color,
          height_cm: row.height_cm,
          weight_kg: row.weight_kg,
          identifications: row.identifications,
          items: [],
        };
        ticketMap.set(row.ticket_number, ticket);
      }

      if (row.item_number) {
        ticket.items.push({
          item_number: row.item_number,
          quantity: Number(row.quantity ?? 0),
          description: row.item_description,
          brand_name: row.brand_name,
          model_number: row.model_number,
          serial_number: row.serial_number,
          amount: Number(row.item_amount ?? 0),
        });
      }
    }

    const tickets = [...ticketMap.values()];
    const missingItemTicketNumbers = tickets
      .filter((ticket) => ticket.items.length === 0)
      .map((ticket) => ticket.ticket_number);

    return {
      from_date: fromDate,
      to_date: toDate,
      tickets,
      missing_item_ticket_numbers: missingItemTicketNumbers,
      total_tickets: tickets.length,
      total_items: tickets.reduce(
        (sum, ticket) =>
          sum +
          ticket.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0,
      ),
      total_amount: Number(
        tickets.reduce((sum, ticket) => sum + ticket.amount, 0).toFixed(2),
      ),
    };
  },

  loadBuybackReport: async (
    input: ReportDateInput,
  ): Promise<BuybackReportResult> => {
    const normalizedInput = ticketInput.normalizeReportDate(input);

    if (!ticketInput.isValidDateKey(normalizedInput.date)) {
      throw createFieldError("date", "Enter a valid report date.");
    }

    const sourceRows = await reportRepo.loadBuybackReportRows(
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

    const rows = await reportRepo.loadInterestReportRows(normalizedInput.date);
    const total = rows.reduce((sum, row) => sum + row.amount_paid, 0);

    return {
      date: normalizedInput.date,
      rows,
      total_interest_paid: Number(total.toFixed(2)),
    };
  },
};
