import type { ClientLookup } from "../utils/clientLookup.ts";
import type { Client } from "../models/client.model.ts";
import type { HairColor } from "../models/hair-color.model.ts";
import type { EyeColor } from "../models/eye-color.model.ts";
import type {
  CitiesResponse,
  ClientFormField,
  SaveClientInput,
} from "../payload-contracts/client.contract.ts";

export type ClientMutationResult =
  | { ok: true; client: Client }
  | { ok: false; field: ClientFormField; message: string };

export type ClientApi = {
  searchClients: (firstName: string, lastName: string) => Promise<Client[]>;
  searchClientsByLookup: (lookup: ClientLookup) => Promise<Client[]>;
  searchClientsByDob: (dateOfBirth: string) => Promise<Client[]>;
  loadCities: () => Promise<CitiesResponse>;
  loadHairColors: () => Promise<string[]>;
  loadHairColorsForAdmin: () => Promise<HairColor[]>;
  loadEyeColors: () => Promise<string[]>;
  loadEyeColorsForAdmin: () => Promise<EyeColor[]>;
  addHairColor: (color: string) => Promise<string>;
  activateHairColor: (color: string) => Promise<HairColor>;
  deactivateHairColor: (color: string) => Promise<HairColor>;
  addEyeColor: (color: string) => Promise<string>;
  activateEyeColor: (color: string) => Promise<EyeColor>;
  deactivateEyeColor: (color: string) => Promise<EyeColor>;
  loadIdTypes: () => Promise<string[]>;
  createClient: (input: SaveClientInput) => Promise<ClientMutationResult>;
  updateClient: (input: SaveClientInput) => Promise<ClientMutationResult>;
  saveClientImage: (fileName: string, base64: string) => Promise<string>;
};
