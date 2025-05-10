export {};

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  heightCm?: number;
  heightFt?: number;
  weightKg?: number;
  weightLb?: number;
  notes?: string;
  pictureUrl?: string;
}

interface IElectronAPI {
  searchCustomer: (firstName: string, lastName: string) => Promise<Customer[]>;
  // add other api
  // addCustomer: (customerData: Omit<Customer, 'id'>) => Promise<Customer>;
  // updateCustomer: (id: number, customerData: Partial<Customer>) => Promise<Customer>;
  // deleteCustomer: (id: number) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
