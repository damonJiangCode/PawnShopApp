import type {
  BuybackReportResult,
  DailyReportResult,
  DailyReportTicket,
  InterestReportResult,
  OverdueReportInput,
  OverdueReportResult,
  OverdueReportTicket,
  ReportDateRangeInput,
} from "../../../shared/payload-contracts/ticket.contract.ts";
import { reportRepo } from "./report.repo.ts";
import { createFieldError } from "../../shared/createFieldError.ts";
import { ticketInput } from "../tickets/ticket.input.ts";
import { INTEREST_REPORT_START_DATE } from "../../../shared/reportSettings.ts";
import { validateReportDateRange } from "../../shared/reportDateRange.ts";

const MAX_REPORT_RANGE_DAYS = 93;
const MAX_REPORT_SOURCE_ROWS = 20_000;

const assertReportSize = (rowCount: number) => {
  if (rowCount > MAX_REPORT_SOURCE_ROWS) {
    throw createFieldError(
      "to_date",
      "This report is too large. Select a smaller date or location range.",
    );
  }
};

const parseLocation = (
  value: string,
  field: "location_from" | "location_to",
) => {
  const normalized = value.trim().toUpperCase();
  const match = /^([A-Z]+)(\d+)$/.exec(normalized);

  if (!match) {
    throw createFieldError(field, "Enter a location such as AA11.");
  }

  return {
    value: normalized,
    prefix: match[1],
    number: Number(match[2]),
  };
};

export const reportService = {
  loadOverdueReport: async (
    input: OverdueReportInput,
  ): Promise<OverdueReportResult> => {
    const dueOnOrBefore = input.due_on_or_before?.trim() ?? "";

    if (!ticketInput.isValidDateKey(dueOnOrBefore)) {
      throw createFieldError(
        "due_on_or_before",
        "Enter a valid Due On or Before date.",
      );
    }

    const locationFrom = parseLocation(
      input.location_from ?? "",
      "location_from",
    );
    const locationTo = parseLocation(input.location_to ?? "", "location_to");

    if (locationFrom.prefix !== locationTo.prefix) {
      throw createFieldError(
        "location_to",
        "From and To locations must use the same letter code.",
      );
    }

    if (locationFrom.number > locationTo.number) {
      throw createFieldError(
        "location_to",
        "To location must be the same as or later than From location.",
      );
    }

    const sourceRows = await reportRepo.loadOverdueReportRows(
      dueOnOrBefore,
      locationFrom.prefix,
      locationFrom.number,
      locationTo.number,
    );
    assertReportSize(sourceRows.length);
    const ticketMap = new Map<number, OverdueReportTicket>();

    for (const row of sourceRows) {
      let ticket = ticketMap.get(row.ticket_number);

      if (!ticket) {
        ticket = {
          ticket_number: row.ticket_number,
          client_name: row.client_name,
          location: row.location,
          transaction_date: row.transaction_date,
          due_date: row.due_date,
          interest_paid_months: row.interest_paid_months,
          items: [],
        };
        ticketMap.set(row.ticket_number, ticket);
      }

      if (row.item_number) {
        ticket.items.push({
          description: row.item_description,
          brand_name: row.brand_name,
          model_number: row.model_number,
          serial_number: row.serial_number,
        });
      }
    }

    const tickets = [...ticketMap.values()];

    return {
      due_on_or_before: dueOnOrBefore,
      location_from: locationFrom.value,
      location_to: locationTo.value,
      tickets,
      total_tickets: tickets.length,
      total_items: tickets.reduce(
        (total, ticket) => total + ticket.items.length,
        0,
      ),
    };
  },

  loadDailyReport: async (
    input: ReportDateRangeInput,
  ): Promise<DailyReportResult> => {
    const { fromDate, toDate } = validateReportDateRange(input, {
      maximumDays: MAX_REPORT_RANGE_DAYS,
    });

    const sourceRows = await reportRepo.loadDailyReportRows(fromDate, toDate);
    assertReportSize(sourceRows.length);
    const ticketMap = new Map<number, DailyReportTicket>();

    for (const row of sourceRows) {
      let ticket = ticketMap.get(row.ticket_number);

      if (!ticket) {
        ticket = {
          ticket_number: row.ticket_number,
          amount: row.ticket_amount,
          description: row.ticket_description,
          client_name: row.client_name,
          gender: row.gender,
          eye_color: row.eye_color,
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
    input: ReportDateRangeInput,
  ): Promise<BuybackReportResult> => {
    const { fromDate, toDate } = validateReportDateRange(input, {
      maximumDays: MAX_REPORT_RANGE_DAYS,
    });

    const sourceRows = await reportRepo.loadBuybackReportRows(fromDate, toDate);
    assertReportSize(sourceRows.length);

    const rows = sourceRows.map((row) => ({
      ticket_number: row.ticket_number,
      pickup_datetime: row.pickup_datetime,
      pickup_amount_paid: Number(row.pickup_amount_paid.toFixed(2)),
      description: row.description,
      client_name: row.client_name,
    }));

    const total = rows.reduce((sum, row) => sum + row.pickup_amount_paid, 0);

    return {
      from_date: fromDate,
      to_date: toDate,
      rows,
      total_buyback_price: Number(total.toFixed(2)),
    };
  },

  loadInterestReport: async (
    input: ReportDateRangeInput,
  ): Promise<InterestReportResult> => {
    const { fromDate, toDate } = validateReportDateRange(input, {
      earliestDate: INTEREST_REPORT_START_DATE,
      maximumDays: MAX_REPORT_RANGE_DAYS,
    });

    const rows = await reportRepo.loadInterestReportRows(fromDate, toDate);
    assertReportSize(rows.length);
    const total = rows.reduce((sum, row) => sum + row.amount_paid, 0);

    return {
      from_date: fromDate,
      to_date: toDate,
      rows,
      total_interest_paid: Number(total.toFixed(2)),
    };
  },
};
