import type { Ticket } from "../types/Ticket.ts";

export type CreatePawnTicketInput = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
  client_number: number;
};

export type CreateSellTicketInput = {
  description: string;
  location: string;
  amount: number;
  employee_password: string;
  client_number: number;
};

export type UpdateTicketInput = {
  ticket_number: number;
  is_lost: boolean;
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

export type TransferTicketPreview = {
  ticket_number: number;
  status: Ticket["status"];
  description: string;
  location: string;
  amount: number;
  previous_client_number: number;
  previous_client_name: string;
};

export type TransferTicketInput = {
  ticket_number: number;
  client_number: number;
};

export type ConvertTicketInput = {
  ticket_number: number;
  target_status: "pawned" | "sold";
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

export type ElectronTicketApi = {
  loadByClient: (clientNumber: number) => Promise<Ticket[]>;
  loadLocations: () => Promise<string[]>;
  createPawn: (payload: CreatePawnTicketInput) => Promise<Ticket>;
  createSell: (payload: CreateSellTicketInput) => Promise<Ticket>;
  update: (payload: UpdateTicketInput) => Promise<Ticket>;
  convert: (payload: ConvertTicketInput) => Promise<Ticket>;
  loadTransferPreview: (
    ticketNumber: number,
  ) => Promise<TransferTicketPreview | null>;
  transfer: (payload: TransferTicketInput) => Promise<Ticket>;
};
