import type { Ticket } from "../models/ticket.model.ts";
import type { HolidayDate } from "../models/holiday-date.model.ts";
import type { Location } from "../models/location.model.ts";
import type {
  ConvertTicketInput,
  BuybackReportResult,
  DailyReportResult,
  ExpireTicketInput,
  InterestReportResult,
  OverdueReportInput,
  OverdueReportResult,
  MarkTicketStolenInput,
  ProcessTicketPaymentsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  ReportDateRangeInput,
  ReportFormField,
  ReverseTicketInput,
  ReverseTicketFormField,
  ReverseTicketResult,
  TicketSearchResult,
  TicketFormField,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
  SaveHolidayInput,
  SaveLocationInput,
} from "../payload-contracts/ticket.contract.ts";

export type ReverseTicketMutationResult =
  | { ok: true; result: ReverseTicketResult }
  | { ok: false; field: ReverseTicketFormField; message: string };

export type TicketMutationResult =
  | { ok: true; ticket: Ticket }
  | { ok: false; field: TicketFormField; message: string };

export type TicketPaymentMutationResult =
  | {
      ok: true;
      picked_up_tickets: Ticket[];
      extended_tickets: Ticket[];
    }
  | { ok: false; field: TicketFormField; message: string };

export type ReportQueryResult<T> =
  | { ok: true; result: T }
  | { ok: false; field: ReportFormField; message: string };

export type TicketApi = {
  loadTicketsByClient: (clientNumber: number) => Promise<Ticket[]>;
  loadHolidayDates: () => Promise<HolidayDate[]>;
  addHolidayDate: (input: SaveHolidayInput) => Promise<HolidayDate>;
  deleteHolidayDate: (holidayDate: string) => Promise<HolidayDate>;
  loadLocations: () => Promise<string[]>;
  loadLocationsForAdmin: () => Promise<Location[]>;
  addLocation: (input: SaveLocationInput) => Promise<Location>;
  deactivateLocation: (location: string) => Promise<Location>;
  searchTicketByNumber: (
    ticketNumber: number,
  ) => Promise<TicketSearchResult | null>;
  searchPaymentTicketByNumber: (
    ticketNumber: number,
  ) => Promise<TicketSearchResult | null>;
  loadBuybackReport: (
    input: ReportDateRangeInput,
  ) => Promise<ReportQueryResult<BuybackReportResult>>;
  loadDailyReport: (
    input: ReportDateRangeInput,
  ) => Promise<ReportQueryResult<DailyReportResult>>;
  loadInterestReport: (
    input: ReportDateRangeInput,
  ) => Promise<ReportQueryResult<InterestReportResult>>;
  loadOverdueReport: (
    input: OverdueReportInput,
  ) => Promise<ReportQueryResult<OverdueReportResult>>;
  createPawnTicket: (
    input: CreatePawnTicketInput,
  ) => Promise<TicketMutationResult>;
  createSellTicket: (
    input: CreateSellTicketInput,
  ) => Promise<TicketMutationResult>;
  updateTicket: (input: UpdateTicketInput) => Promise<TicketMutationResult>;
  convertTicket: (input: ConvertTicketInput) => Promise<TicketMutationResult>;
  expireTicket: (input: ExpireTicketInput) => Promise<TicketMutationResult>;
  markTicketStolen: (
    input: MarkTicketStolenInput,
  ) => Promise<TicketMutationResult>;
  processPayments: (
    input: ProcessTicketPaymentsInput,
  ) => Promise<TicketPaymentMutationResult>;
  loadTransferTicketPreview: (
    ticketNumber: number,
  ) => Promise<TransferTicketPreview | null>;
  transferTicket: (input: TransferTicketInput) => Promise<TicketMutationResult>;
  reverseTicket: (
    input: ReverseTicketInput,
  ) => Promise<ReverseTicketMutationResult>;
};
