/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    electronAPI: {
      searchCustomers: (firstName: string, lastName: string) => Promise<any>;
    };
  }
}
