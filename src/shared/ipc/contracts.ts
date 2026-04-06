import type { Client, ID } from "../types/Client.ts";
import type { Item } from "../types/Item.ts";
import type { Ticket } from "../types/Ticket.ts";

export type CitiesResponse = {
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
};

export type ClientNotesAction = "keep" | "clear" | "append_signature";

export type SaveClientInput = {
  client: Client;
  identifications: ID[];
  employee_password?: string;
  notes_action?: ClientNotesAction;
};

export type CreatePawnTicketInput = {
  description: string;
  is_lost: boolean;
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
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

export type ElectronClientApi = {
  search: (firstName: string, lastName: string) => Promise<Client[]>;
  loadCities: () => Promise<CitiesResponse>;
  loadHairColors: () => Promise<string[]>;
  loadEyeColors: () => Promise<string[]>;
  loadIdTypes: () => Promise<string[]>;
  create: (payload: SaveClientInput) => Promise<Client>;
  update: (payload: SaveClientInput) => Promise<Client>;
  delete: (clientNumber: number) => Promise<boolean>;
  saveImage: (fileName: string, base64: string) => Promise<string>;
  loadImage: (imagePath: string) => Promise<string>;
};

export type ElectronTicketApi = {
  loadByClient: (clientNumber: number) => Promise<Ticket[]>;
  loadLocations: () => Promise<string[]>;
  createPawn: (payload: CreatePawnTicketInput) => Promise<Ticket>;
  createSell: (payload: CreateSellTicketInput) => Promise<Ticket>;
  update: (payload: UpdateTicketInput) => Promise<Ticket>;
};

export type ElectronItemApi = {
  loadByTicket: (ticketNumber: number) => Promise<Item[]>;
};

export type ElectronApi = {
  client: ElectronClientApi;
  ticket: ElectronTicketApi;
  item: ElectronItemApi;
};
