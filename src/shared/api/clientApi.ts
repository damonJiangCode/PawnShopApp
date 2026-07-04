import type { Client } from "../types/Client.ts";
import type { HairColor } from "../types/hairColor.ts";
import type { EyeColor } from "../types/eyeColor.ts";
import type {
  CitiesResponse,
  SaveClientInput,
} from "../types/clientApiTypes.ts";

export type ElectronClientApi = {
  search: (firstName: string, lastName: string) => Promise<Client[]>;
  searchByDob: (dateOfBirth: string) => Promise<Client[]>;
  loadCities: () => Promise<CitiesResponse>;
  loadHairColors: () => Promise<string[]>;
  loadAdminHairColors: () => Promise<HairColor[]>;
  loadEyeColors: () => Promise<string[]>;
  loadAdminEyeColors: () => Promise<EyeColor[]>;
  addHairColor: (color: string) => Promise<string>;
  activateHairColor: (color: string) => Promise<HairColor>;
  deactivateHairColor: (color: string) => Promise<HairColor>;
  addEyeColor: (color: string) => Promise<string>;
  activateEyeColor: (color: string) => Promise<EyeColor>;
  deactivateEyeColor: (color: string) => Promise<EyeColor>;
  loadIdTypes: () => Promise<string[]>;
  create: (input: SaveClientInput) => Promise<Client>;
  update: (input: SaveClientInput) => Promise<Client>;
  delete: (clientNumber: number) => Promise<boolean>;
  saveImage: (fileName: string, base64: string) => Promise<string>;
  loadImage: (imagePath: string) => Promise<string>;
};
