import type { Client } from "../../shared/types/Client";
import type { HairColor } from "../../shared/types/hairColor";
import type { EyeColor } from "../../shared/types/eyeColor";
import type {
  CitiesResponse,
  ClientNotesAction,
  SaveClientInput,
} from "../../shared/types/clientPayload";
import { getElectronApi } from "./electronApi";
import { extractBackendFieldError } from "../utils/formError";

export type ClientFormField = "employee_password";

export type ClientFormError = Error & {
  field?: ClientFormField;
};

const emptyCities = (): CitiesResponse => ({
  provinces: [],
  citiesByProvince: {},
});

const normalizeSearchInput = (value?: string) => value?.trim() ?? "";

const createFieldError = (
  field: ClientFormField,
  message: string,
): ClientFormError => {
  const error = new Error(message) as ClientFormError;
  error.field = field;
  return error;
};

const mapBackendError = (error: unknown): Error => {
  if (!(error instanceof Error)) {
    return new Error("Unknown client error");
  }

  const backendFieldError = extractBackendFieldError(error.message);

  if (!backendFieldError) {
    return error;
  }

  return createFieldError(
    backendFieldError.field as ClientFormField,
    backendFieldError.message,
  );
};

const normalizeSaveClientInput = (input: SaveClientInput): SaveClientInput => ({
  client: {
    ...input.client,
    first_name: input.client.first_name?.trim() ?? "",
    last_name: input.client.last_name?.trim() ?? "",
    middle_name: input.client.middle_name?.trim() ?? "",
    gender: input.client.gender?.trim() ?? "",
    hair_color: input.client.hair_color?.trim().toUpperCase() ?? "",
    eye_color: input.client.eye_color?.trim().toUpperCase() ?? "",
    address: input.client.address?.trim() ?? "",
    postal_code: input.client.postal_code?.trim() ?? "",
    city: input.client.city?.trim() ?? "",
    province: input.client.province?.trim() ?? "",
    country: input.client.country?.trim() ?? "",
    email: input.client.email?.trim() ?? "",
    phone: input.client.phone?.trim() ?? "",
    notes: input.client.notes?.trim() ?? "",
    image_path: input.client.image_path?.trim() ?? "",
  },
  identifications: (input.identifications ?? []).map((id) => ({
    ...id,
    id_type: id.id_type?.trim() ?? "",
    id_value: id.id_value?.trim() ?? "",
  })),
  employee_password: input.employee_password?.trim() ?? "",
  notes_action: input.notes_action ?? "keep",
});

export const clientService = {
  searchClients: async (
    firstName: string,
    lastName: string,
  ): Promise<Client[]> => {
    const normalizedFirstName = normalizeSearchInput(firstName);
    const normalizedLastName = normalizeSearchInput(lastName);

    if (!normalizedFirstName && !normalizedLastName) {
      return [];
    }

    const api = getElectronApi()?.client;
    if (!api) {
      return [];
    }

    try {
      return await api.search(normalizedFirstName, normalizedLastName);
    } catch {
      return [];
    }
  },

  searchClientsByDob: async (dateOfBirth: string): Promise<Client[]> => {
    const normalizedDob = normalizeSearchInput(dateOfBirth);

    if (!normalizedDob) {
      return [];
    }

    const api = getElectronApi()?.client;
    if (!api) {
      return [];
    }

    try {
      return await api.searchByDob(normalizedDob);
    } catch {
      return [];
    }
  },

  loadCities: async (): Promise<CitiesResponse> => {
    const api = getElectronApi()?.client;
    if (!api) {
      return emptyCities();
    }

    try {
      return await api.loadCities();
    } catch {
      return emptyCities();
    }
  },

  loadHairColors: async (): Promise<string[]> => {
    const api = getElectronApi()?.client;
    if (!api) {
      return [];
    }

    try {
      return await api.loadHairColors();
    } catch {
      return [];
    }
  },

  loadAdminHairColors: async (): Promise<HairColor[]> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.loadAdminHairColors();
  },

  addHairColor: async (color: string): Promise<string> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.addHairColor(color.trim().toUpperCase());
  },

  deactivateHairColor: async (color: string): Promise<HairColor> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.deactivateHairColor(color.trim().toUpperCase());
  },

  activateHairColor: async (color: string): Promise<HairColor> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.activateHairColor(color.trim().toUpperCase());
  },

  loadEyeColors: async (): Promise<string[]> => {
    const api = getElectronApi()?.client;
    if (!api) {
      return [];
    }

    try {
      return await api.loadEyeColors();
    } catch {
      return [];
    }
  },

  loadAdminEyeColors: async (): Promise<EyeColor[]> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.loadAdminEyeColors();
  },

  addEyeColor: async (color: string): Promise<string> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.addEyeColor(color.trim().toUpperCase());
  },

  deactivateEyeColor: async (color: string): Promise<EyeColor> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.deactivateEyeColor(color.trim().toUpperCase());
  },

  activateEyeColor: async (color: string): Promise<EyeColor> => {
    const api = getElectronApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.activateEyeColor(color.trim().toUpperCase());
  },

  loadIdTypes: async (): Promise<string[]> => {
    const api = getElectronApi()?.client;
    if (!api) {
      return [];
    }

    try {
      return await api.loadIdTypes();
    } catch {
      return [];
    }
  },

  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    const api = getElectronApi()?.client;
    if (!api) {
      throw new Error("saveClientImage is not available");
    }

    return api.saveImage(fileName, base64);
  },

  loadClientImage: async (imagePath?: string): Promise<string | null> => {
    const api = getElectronApi()?.client;

    if (!imagePath || !api) {
      return null;
    }

    try {
      return await api.loadImage(imagePath);
    } catch {
      return null;
    }
  },

  createClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getElectronApi()?.client;
    if (!api) {
      throw new Error("createClient is not available");
    }

    try {
      return await api.create(normalizeSaveClientInput(input));
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  updateClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getElectronApi()?.client;
    if (!api) {
      throw new Error("updateClient is not available");
    }

    try {
      return await api.update(normalizeSaveClientInput(input));
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  deleteClient: async (clientNumber: number): Promise<boolean> => {
    const api = getElectronApi()?.client;
    if (!api) {
      return false;
    }

    try {
      return await api.delete(clientNumber);
    } catch {
      return false;
    }
  },
};

export type { CitiesResponse, ClientNotesAction, SaveClientInput };
