import type { Client, ID } from "../types/Client.ts";

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
