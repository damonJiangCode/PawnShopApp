import type { Client, ID } from "../../../shared/types/Client";

type CitiesResponse = {
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
};

type EmployeeMatch = {
  employee_number: number;
  first_name: string;
  last_name: string;
};

type ClientPayload = {
  client: Client;
  identifications: ID[];
};

const getElectronApi = () => (window as any).electronAPI;

const emptyCities = (): CitiesResponse => ({
  provinces: [],
  citiesByProvince: {},
});

export const clientService = {
  searchClients: async (
    firstName: string,
    lastName: string,
  ): Promise<Client[]> => {
    const safeFirst = firstName?.trim() ?? "";
    const safeLast = lastName?.trim() ?? "";

    if (!safeFirst && !safeLast) {
      return [];
    }

    if (!getElectronApi()?.searchClients) {
      return [];
    }

    try {
      return await getElectronApi().searchClients(safeFirst, safeLast);
    } catch {
      return [];
    }
  },

  loadCities: async (): Promise<CitiesResponse> => {
    if (!getElectronApi()?.getCities) {
      return emptyCities();
    }

    try {
      return await getElectronApi().getCities();
    } catch {
      return emptyCities();
    }
  },

  loadHairColors: async (): Promise<string[]> => {
    if (!getElectronApi()?.getHairColors) {
      return [];
    }

    try {
      return await getElectronApi().getHairColors();
    } catch {
      return [];
    }
  },

  loadEyeColors: async (): Promise<string[]> => {
    if (!getElectronApi()?.getEyeColors) {
      return [];
    }

    try {
      return await getElectronApi().getEyeColors();
    } catch {
      return [];
    }
  },

  loadIdTypes: async (): Promise<string[]> => {
    if (!getElectronApi()?.getIdTypes) {
      return [];
    }

    try {
      return await getElectronApi().getIdTypes();
    } catch {
      return [];
    }
  },

  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    if (!getElectronApi()?.saveClientImage) {
      throw new Error("saveClientImage is not available");
    }

    return getElectronApi().saveClientImage(fileName, base64);
  },

  getClientImage: async (imagePath?: string): Promise<string | null> => {
    if (!imagePath || !getElectronApi()?.getClientImage) {
      return null;
    }

    try {
      return await getElectronApi().getClientImage(imagePath);
    } catch {
      return null;
    }
  },

  addClient: async (payload: ClientPayload): Promise<Client> => {
    if (!getElectronApi()?.addClient) {
      throw new Error("addClient is not available");
    }

    return getElectronApi().addClient(payload);
  },

  updateClient: async (payload: ClientPayload): Promise<Client> => {
    if (!getElectronApi()?.updateClient) {
      throw new Error("updateClient is not available");
    }

    return getElectronApi().updateClient(payload);
  },

  deleteClient: async (clientNumber: number): Promise<boolean> => {
    if (!getElectronApi()?.deleteClient) {
      return false;
    }

    try {
      return await getElectronApi().deleteClient(clientNumber);
    } catch {
      return false;
    }
  },

  verifyEmployeePassword: async (
    password: string,
  ): Promise<EmployeeMatch | null> => {
    const safePassword = password?.trim() ?? "";

    if (!safePassword || !getElectronApi()?.verifyEmployeePassword) {
      return null;
    }

    try {
      return await getElectronApi().verifyEmployeePassword(safePassword);
    } catch {
      return null;
    }
  },
};

export const {
  addClient,
  deleteClient,
  getClientImage,
  loadCities,
  loadEyeColors,
  loadHairColors,
  loadIdTypes,
  saveClientImage,
  searchClients,
  updateClient,
  verifyEmployeePassword,
} = clientService;
