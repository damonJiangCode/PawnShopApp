import type { Client, ID } from "../../../shared/types/Client";
import { getElectronApi } from "./electronApi";
import { extractBackendFieldError } from "../utils/formError";

export type CitiesResponse = {
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
};

export type ClientFormField = "employee_password";

export type ClientFormError = Error & {
  field?: ClientFormField;
};

export type ClientNotesAction = "keep" | "clear" | "append_signature";

export type SaveClientInput = {
  client: Client;
  identifications: ID[];
  employee_password?: string;
  notes_action?: ClientNotesAction;
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
    hair_color: input.client.hair_color?.trim() ?? "",
    eye_color: input.client.eye_color?.trim() ?? "",
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
    if (!api?.search) {
      return [];
    }

    try {
      return (await api.search(normalizedFirstName, normalizedLastName)) as Client[];
    } catch {
      return [];
    }
  },

  loadCities: async (): Promise<CitiesResponse> => {
    const api = getElectronApi()?.client;
    if (!api?.loadCities) {
      return emptyCities();
    }

    try {
      return (await api.loadCities()) as CitiesResponse;
    } catch {
      return emptyCities();
    }
  },

  loadHairColors: async (): Promise<string[]> => {
    const api = getElectronApi()?.client;
    if (!api?.loadHairColors) {
      return [];
    }

    try {
      return (await api.loadHairColors()) as string[];
    } catch {
      return [];
    }
  },

  loadEyeColors: async (): Promise<string[]> => {
    const api = getElectronApi()?.client;
    if (!api?.loadEyeColors) {
      return [];
    }

    try {
      return (await api.loadEyeColors()) as string[];
    } catch {
      return [];
    }
  },

  loadIdTypes: async (): Promise<string[]> => {
    const api = getElectronApi()?.client;
    if (!api?.loadIdTypes) {
      return [];
    }

    try {
      return (await api.loadIdTypes()) as string[];
    } catch {
      return [];
    }
  },

  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    const api = getElectronApi()?.client;
    if (!api?.saveImage) {
      throw new Error("saveClientImage is not available");
    }

    return api.saveImage(fileName, base64) as Promise<string>;
  },

  loadClientImage: async (imagePath?: string): Promise<string | null> => {
    const api = getElectronApi()?.client;

    if (!imagePath || !api?.loadImage) {
      return null;
    }

    try {
      return (await api.loadImage(imagePath)) as string | null;
    } catch {
      return null;
    }
  },

  createClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getElectronApi()?.client;
    if (!api?.create) {
      throw new Error("createClient is not available");
    }

    try {
      return (await api.create(normalizeSaveClientInput(input))) as Client;
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  updateClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getElectronApi()?.client;
    if (!api?.update) {
      throw new Error("updateClient is not available");
    }

    try {
      return (await api.update(normalizeSaveClientInput(input))) as Client;
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  deleteClient: async (clientNumber: number): Promise<boolean> => {
    const api = getElectronApi()?.client;
    if (!api?.delete) {
      return false;
    }

    try {
      return (await api.delete(clientNumber)) as boolean;
    } catch {
      return false;
    }
  },
};
