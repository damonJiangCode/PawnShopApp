import { Customer, Identification } from "../../shared/models/Customer";

export {};

interface ElectronAPI {
  searchCustomer: (firstName: string, lastName: string) => Promise<Customer[]>;
  addCustomer: (
    customer: Partial<Customer>,
    ids: Identification[]
  ) => Promise<Customer>;
  saveCustomerImage: (fileName: string, base64: string) => Promise<string>;
  getLocations: () => Promise<{
    provinces: string[];
    citiesByProvince: { [key: string]: string[] };
  }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
