import { Customer, ID } from "../../shared/models/Customer";

interface ElectronAPI {
  searchCustomer: (firstName: string, lastName: string) => Promise<Customer[]>;
  getIDs: (customerID: number) => Promise<ID[]>;
  addCustomer: (payload: {
    customer: Customer;
    ids: ID[];
  }) => Promise<Customer>;
  saveCustomerImage: (fileName: string, base64: string) => Promise<string>;
  getCustomerImage: (customerNumber: number) => Promise<string>;
  getCities: () => Promise<{
    provinces: string[];
    citiesByProvince: { [key: string]: string[] };
  }>;
  getHairColors: () => Promise<string[]>;
  getEyeColors: () => Promise<string[]>;
  getIdTypes: () => Promise<string[]>;
  getTickets: (customerNumber: number) => Promise<any[]>;
  getItems: (ticketNumber: number) => Promise<any[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
