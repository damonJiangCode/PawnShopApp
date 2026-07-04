import type { Ticket } from "../types/Ticket.ts";
import type { HolidayDate, SaveHolidayInput } from "../types/holidayDate.ts";
import type { Location, SaveLocationInput } from "../types/location.ts";
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
} from "../types/ticketApiTypes.ts";

export type ElectronTicketApi = {
  loadByClient: (clientNumber: number) => Promise<Ticket[]>;
  loadHolidayDates: () => Promise<HolidayDate[]>;
  addHolidayDate: (input: SaveHolidayInput) => Promise<HolidayDate>;
  deleteHolidayDate: (holidayDate: string) => Promise<HolidayDate>;
  loadLocations: () => Promise<string[]>;
  loadAdminLocations: () => Promise<Location[]>;
  addLocation: (input: SaveLocationInput) => Promise<Location>;
  deactivateLocation: (location: string) => Promise<Location>;
  searchTicket: (ticketNumber: number) => Promise<TicketSearchResult | null>;
  searchPaymentTicket: (
    ticketNumber: number,
  ) => Promise<TicketSearchResult | null>;
  loadBuybackReport: (input: ReportDateInput) => Promise<BuybackReportResult>;
  loadInterestReport: (input: ReportDateInput) => Promise<InterestReportResult>;
  createPawn: (input: CreatePawnTicketInput) => Promise<Ticket>;
  createSell: (input: CreateSellTicketInput) => Promise<Ticket>;
  update: (input: UpdateTicketInput) => Promise<Ticket>;
  convert: (input: ConvertTicketInput) => Promise<Ticket>;
  expire: (input: ExpireTicketInput) => Promise<Ticket>;
  markStolen: (input: MarkTicketStolenInput) => Promise<Ticket>;
  pickup: (input: PickupTicketsInput) => Promise<Ticket[]>;
  extend: (input: ExtendTicketsInput) => Promise<Ticket[]>;
  loadTransferPreview: (
    ticketNumber: number,
  ) => Promise<TransferTicketPreview | null>;
  transfer: (input: TransferTicketInput) => Promise<Ticket>;
};
