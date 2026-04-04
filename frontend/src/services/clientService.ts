import type { Client, ID } from "../../../shared/types/Client";

type CitiesResponse = {
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

const FIELD_ERROR_PREFIX = "[field-error]";
const getElectronApi = () => (window as any).electronAPI;
const getApi = getElectronApi;

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

  if (!error.message.startsWith(FIELD_ERROR_PREFIX)) {
    return error;
  }

  const payload = error.message.slice(FIELD_ERROR_PREFIX.length);
  const separatorIndex = payload.indexOf(":");

  if (separatorIndex === -1) {
    return error;
  }

  const field = payload.slice(0, separatorIndex) as ClientFormField;
  const message = payload.slice(separatorIndex + 1).trim();
  return createFieldError(field, message || error.message);
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

    const api = getApi();
    if (!api?.searchClients) {
      return [];
    }

    try {
      return await api.searchClients(normalizedFirstName, normalizedLastName);
    } catch {
      return [];
    }
  },

  loadCities: async (): Promise<CitiesResponse> => {
    const api = getApi();
    if (!api?.getCities) {
      return emptyCities();
    }

    try {
      return await api.getCities();
    } catch {
      return emptyCities();
    }
  },

  loadHairColors: async (): Promise<string[]> => {
    const api = getApi();
    if (!api?.getHairColors) {
      return [];
    }

    try {
      return await api.getHairColors();
    } catch {
      return [];
    }
  },

  loadEyeColors: async (): Promise<string[]> => {
    const api = getApi();
    if (!api?.getEyeColors) {
      return [];
    }

    try {
      return await api.getEyeColors();
    } catch {
      return [];
    }
  },

  loadIdTypes: async (): Promise<string[]> => {
    const api = getApi();
    if (!api?.getIdTypes) {
      return [];
    }

    try {
      return await api.getIdTypes();
    } catch {
      return [];
    }
  },

  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    const api = getApi();
    if (!api?.saveClientImage) {
      throw new Error("saveClientImage is not available");
    }

    return api.saveClientImage(fileName, base64);
  },

  loadClientImage: async (imagePath?: string): Promise<string | null> => {
    const api = getApi();

    if (!imagePath || !api?.getClientImage) {
      return null;
    }

    try {
      return await api.getClientImage(imagePath);
    } catch {
      return null;
    }
  },

  createClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getApi();
    if (!api?.addClient) {
      throw new Error("createClient is not available");
    }

    try {
      return await api.addClient(normalizeSaveClientInput(input));
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  updateClient: async (input: SaveClientInput): Promise<Client> => {
    const api = getApi();
    if (!api?.updateClient) {
      throw new Error("updateClient is not available");
    }

    try {
      return await api.updateClient(normalizeSaveClientInput(input));
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  deleteClient: async (clientNumber: number): Promise<boolean> => {
    const api = getApi();
    if (!api?.deleteClient) {
      return false;
    }

    try {
      return await api.deleteClient(clientNumber);
    } catch {
      return false;
    }
  },
};

export const {
  createClient,
  deleteClient,
  loadClientImage,
  loadCities,
  loadEyeColors,
  loadHairColors,
  loadIdTypes,
  saveClientImage,
  searchClients,
  updateClient,
} = clientService;
