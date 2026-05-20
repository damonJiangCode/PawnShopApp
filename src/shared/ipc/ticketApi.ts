import type { Ticket } from "../types/Ticket.ts";
import type { HolidayDate } from "../types/holidayDate.ts";
import type {
  ConvertTicketInput,
  ExtendTicketsInput,
  ExpireTicketInput,
  PaymentTicketSearchPreview,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
} from "../types/ticketPayload.ts";

export type ElectronTicketApi = {
  loadByClient: (clientNumber: number) => Promise<Ticket[]>;
  loadHolidayDates: () => Promise<HolidayDate[]>;
  loadLocations: () => Promise<string[]>;
  searchPaymentTicket: (
    ticketNumber: number,
  ) => Promise<PaymentTicketSearchPreview | null>;
  createPawn: (payload: CreatePawnTicketInput) => Promise<Ticket>;
  createSell: (payload: CreateSellTicketInput) => Promise<Ticket>;
  update: (payload: UpdateTicketInput) => Promise<Ticket>;
  convert: (payload: ConvertTicketInput) => Promise<Ticket>;
  expire: (payload: ExpireTicketInput) => Promise<Ticket>;
  pickup: (payload: PickupTicketsInput) => Promise<Ticket[]>;
  extend: (payload: ExtendTicketsInput) => Promise<Ticket[]>;
  loadTransferPreview: (
    ticketNumber: number,
  ) => Promise<TransferTicketPreview | null>;
  transfer: (payload: TransferTicketInput) => Promise<Ticket>;
};
