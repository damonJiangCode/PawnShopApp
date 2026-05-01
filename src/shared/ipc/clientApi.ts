import type { Client } from "../types/Client.ts";
import type { CitiesResponse, SaveClientInput } from "../types/clientPayload.ts";

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
