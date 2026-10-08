import type { ClientLookup } from "../../../shared/utils/clientLookup";
import type { Client } from "../../../shared/models/client.model";
import type { HairColor } from "../../../shared/models/hair-color.model";
import type { EyeColor } from "../../../shared/models/eye-color.model";
import type {
  CitiesResponse,
  ClientFormField,
  ClientNotesAction,
  SaveClientInput,
} from "../../../shared/payload-contracts/client.contract";
import type { ClientMutationResult } from "../../../shared/api-contracts/clientApi.contract";
import { getAppApi } from "../../shared/api/app.api";
import { extractBackendFieldError } from "../../shared/utils/formError";

export type ClientFormError = Error & {
  field?: ClientFormField;
};

const unwrapClientMutation = (result: ClientMutationResult): Client => {
  if (result.ok) {
    return result.client;
  }

  return (() => {
    throw createFieldError(result.field, result.message);
  })();
};

const normalizeSearchInput = (value?: string) => value?.trim() ?? "";
const normalizeNameInput = (value?: string) =>
  value?.trim().toUpperCase() ?? "";
const normalizeUpperTextInput = (value?: string) =>
  value?.trim().toUpperCase() ?? "";

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
    first_name: normalizeNameInput(input.client.first_name),
    last_name: normalizeNameInput(input.client.last_name),
    middle_name: normalizeNameInput(input.client.middle_name),
    gender: input.client.gender?.trim().toUpperCase() ?? "",
    hair_color: input.client.hair_color?.trim().toUpperCase() ?? "",
    eye_color: input.client.eye_color?.trim().toUpperCase() ?? "",
    address: normalizeUpperTextInput(input.client.address),
    postal_code: normalizeUpperTextInput(input.client.postal_code),
    city: normalizeUpperTextInput(input.client.city),
    province: normalizeUpperTextInput(input.client.province),
    country: normalizeUpperTextInput(input.client.country),
    email: normalizeUpperTextInput(input.client.email),
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

export const clientApi = {
  searchClientsByLookup: async (lookup: ClientLookup): Promise<Client[]> => {
    const api = getAppApi()?.client;
    if (!api) throw new Error("Client API is unavailable.");
    return api.searchClientsByLookup(lookup);
  },
  searchClients: async (
    firstName: string,
    lastName: string,
  ): Promise<Client[]> => {
    const normalizedFirstName = normalizeSearchInput(firstName);
    const normalizedLastName = normalizeSearchInput(lastName);

    if (!normalizedFirstName && !normalizedLastName) {
      return [];
    }

    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("Client API is unavailable.");
    }

    return api.searchClients(normalizedFirstName, normalizedLastName);
  },

  searchClientsByDob: async (dateOfBirth: string): Promise<Client[]> => {
    const normalizedDob = normalizeSearchInput(dateOfBirth);

    if (!normalizedDob) {
      return [];
    }

    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("Client API is unavailable.");
    }

    return api.searchClientsByDob(normalizedDob);
  },

  loadCities: async (): Promise<CitiesResponse> => {
    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("Client API is unavailable.");
    }

    return api.loadCities();
  },

  loadHairColors: async (): Promise<string[]> => {
    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("Client API is unavailable.");
    }

    return api.loadHairColors();
  },

  loadHairColorsForAdmin: async (): Promise<HairColor[]> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.loadHairColorsForAdmin();
  },

  addHairColor: async (color: string): Promise<string> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.addHairColor(color.trim().toUpperCase());
  },

  deactivateHairColor: async (color: string): Promise<HairColor> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.deactivateHairColor(color.trim().toUpperCase());
  },

  activateHairColor: async (color: string): Promise<HairColor> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Hair color API is unavailable.");
    }

    return api.activateHairColor(color.trim().toUpperCase());
  },

  loadEyeColors: async (): Promise<string[]> => {
    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("Client API is unavailable.");
    }

    return api.loadEyeColors();
  },

  loadEyeColorsForAdmin: async (): Promise<EyeColor[]> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.loadEyeColorsForAdmin();
  },

  addEyeColor: async (color: string): Promise<string> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.addEyeColor(color.trim().toUpperCase());
  },

  deactivateEyeColor: async (color: string): Promise<EyeColor> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.deactivateEyeColor(color.trim().toUpperCase());
  },

  activateEyeColor: async (color: string): Promise<EyeColor> => {
    const api = getAppApi()?.client;

    if (!api) {
      throw new Error("Eye color API is unavailable.");
    }

    return api.activateEyeColor(color.trim().toUpperCase());
  },

  loadIdTypes: async (): Promise<string[]> => {
    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("Client API is unavailable.");
    }

    return api.loadIdTypes();
  },

  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("saveClientImage is not available");
    }

    return api.saveClientImage(fileName, base64);
  },

  createClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("createClient is not available");
    }

    try {
      return unwrapClientMutation(
        await api.createClient(normalizeSaveClientInput(input)),
      );
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  updateClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getAppApi()?.client;
    if (!api) {
      throw new Error("updateClient is not available");
    }

    try {
      return unwrapClientMutation(
        await api.updateClient(normalizeSaveClientInput(input)),
      );
    } catch (error) {
      throw mapBackendError(error);
    }
  },
};

export type {
  CitiesResponse,
  ClientFormField,
  ClientNotesAction,
  SaveClientInput,
};
