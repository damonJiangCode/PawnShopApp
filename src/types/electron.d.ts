import { Customer, Identification } from "../../shared/models/Customer";

// export {};

interface ElectronAPI {
  searchCustomer: (firstName: string, lastName: string) => Promise<Customer[]>;
  addCustomer: (payload: {
    customer: Customer;
    ids: Identification[];
  }) => Promise<Customer>;
  saveCustomerImage: (fileName: string, base64: string) => Promise<string>;
  getCities: () => Promise<{
    provinces: string[];
    citiesByProvince: { [key: string]: string[] };
  }>;
  getHairColors: () => Promise<string[]>;
  getEyeColors: () => Promise<string[]>;
  getIdTypes: () => Promise<string[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
