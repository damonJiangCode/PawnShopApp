import type { Ticket } from "../models/ticket.model.ts";
import type { HolidayDate } from "../models/holiday-date.model.ts";
import type { Location } from "../models/location.model.ts";
import type {
  ConvertTicketInput,
  BuybackReportResult,
  ExtendTicketsInput,
  ExpireTicketInput,
  InterestReportResult,
  MarkTicketStolenInput,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  ReportDateInput,
  TicketSearchResult,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
  SaveHolidayInput,
  SaveLocationInput,
} from "../contracts/ticket.contract.ts";

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
  loadBuybackReport: (input: ReportDateInput) => Promise<BuybackReportResult>;
  loadInterestReport: (input: ReportDateInput) => Promise<InterestReportResult>;
  createPawnTicket: (input: CreatePawnTicketInput) => Promise<Ticket>;
  createSellTicket: (input: CreateSellTicketInput) => Promise<Ticket>;
  updateTicket: (input: UpdateTicketInput) => Promise<Ticket>;
  convertTicket: (input: ConvertTicketInput) => Promise<Ticket>;
  expireTicket: (input: ExpireTicketInput) => Promise<Ticket>;
  markTicketStolen: (input: MarkTicketStolenInput) => Promise<Ticket>;
  pickupTickets: (input: PickupTicketsInput) => Promise<Ticket[]>;
  extendTickets: (input: ExtendTicketsInput) => Promise<Ticket[]>;
  loadTransferTicketPreview: (
    ticketNumber: number,
  ) => Promise<TransferTicketPreview | null>;
  transferTicket: (input: TransferTicketInput) => Promise<Ticket>;
};
