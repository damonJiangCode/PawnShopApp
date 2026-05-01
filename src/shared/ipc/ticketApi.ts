import type { Ticket } from "../types/Ticket.ts";
import type {
  ConvertTicketInput,
  ExpireTicketInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
} from "../types/ticketPayload.ts";

export type ElectronTicketApi = {
  loadByClient: (clientNumber: number) => Promise<Ticket[]>;
  loadLocations: () => Promise<string[]>;
  createPawn: (payload: CreatePawnTicketInput) => Promise<Ticket>;
  createSell: (payload: CreateSellTicketInput) => Promise<Ticket>;
  update: (payload: UpdateTicketInput) => Promise<Ticket>;
  convert: (payload: ConvertTicketInput) => Promise<Ticket>;
  expire: (payload: ExpireTicketInput) => Promise<Ticket>;
  loadTransferPreview: (
    ticketNumber: number,
  ) => Promise<TransferTicketPreview | null>;
  transfer: (payload: TransferTicketInput) => Promise<Ticket>;
};
