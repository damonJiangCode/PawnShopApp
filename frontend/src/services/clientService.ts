import type { Client, ID } from "../../../shared/types/Client";

type CitiesResponse = {
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
};

export type EmployeeMatch = {
  employee_number: number;
  first_name: string;
  last_name: string;
};

type SaveClientPayload = {
  client: Client;
  identifications: ID[];
};

const getElectronApi = () => (window as any).electronAPI;
const getApi = getElectronApi;

const emptyCities = (): CitiesResponse => ({
  provinces: [],
  citiesByProvince: {},
});

const normalizeSearchInput = (value?: string) => value?.trim() ?? "";
const normalizeEmployeePassword = (value?: string) => value?.trim() ?? "";

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

  addClient: async (payload: SaveClientPayload): Promise<Client> => {
    const api = getApi();
    if (!api?.addClient) {
      throw new Error("addClient is not available");
    }

    return api.addClient(payload);
  },

  updateClient: async (payload: SaveClientPayload): Promise<Client> => {
    const api = getApi();
    if (!api?.updateClient) {
      throw new Error("updateClient is not available");
    }

    return api.updateClient(payload);
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

  loadEmployeeMatchByPassword: async (
    password: string,
  ): Promise<EmployeeMatch | null> => {
    const normalizedPassword = normalizeEmployeePassword(password);
    const api = getApi();

    if (!normalizedPassword || !api?.verifyEmployeePassword) {
      return null;
    }

    try {
      return await api.verifyEmployeePassword(normalizedPassword);
    } catch {
      return null;
    }
  },
};

export const {
  addClient,
  deleteClient,
  loadClientImage,
  loadCities,
  loadEmployeeMatchByPassword,
  loadEyeColors,
  loadHairColors,
  loadIdTypes,
  saveClientImage,
  searchClients,
  updateClient,
} = clientService;
