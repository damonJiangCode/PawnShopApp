import type { Ticket } from "../types/Ticket.ts";
import type { HolidayDate, SaveHolidayInput } from "../types/holidayDate.ts";
import type { Location, SaveLocationInput } from "../types/location.ts";
import type {
  ConvertTicketInput,
  ExtendTicketsInput,
  ExpireTicketInput,
  MarkTicketStolenInput,
  PaymentTicketSearchPreview,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TicketSearchResult,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
} from "../types/ticketPayload.ts";

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
  ) => Promise<PaymentTicketSearchPreview | null>;
  createPawn: (payload: CreatePawnTicketInput) => Promise<Ticket>;
  createSell: (payload: CreateSellTicketInput) => Promise<Ticket>;
  update: (payload: UpdateTicketInput) => Promise<Ticket>;
  convert: (payload: ConvertTicketInput) => Promise<Ticket>;
  expire: (payload: ExpireTicketInput) => Promise<Ticket>;
  markStolen: (payload: MarkTicketStolenInput) => Promise<Ticket>;
  pickup: (payload: PickupTicketsInput) => Promise<Ticket[]>;
  extend: (payload: ExtendTicketsInput) => Promise<Ticket[]>;
  loadTransferPreview: (
    ticketNumber: number,
  ) => Promise<TransferTicketPreview | null>;
  transfer: (payload: TransferTicketInput) => Promise<Ticket>;
};
