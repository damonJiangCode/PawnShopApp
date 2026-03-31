import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";

export const transactionApi = {
  getTickets: async (clientNumber: number): Promise<Ticket[]> => {
    return (window as any).electronAPI.getTickets(clientNumber);
  },

  getItems: async (ticketNumber: number): Promise<Item[]> => {
    return (window as any).electronAPI.getItems(ticketNumber);
  },

  getEmployeeName: async (
    employeePassword: string,
  ): Promise<string | null> => {
    return (window as any).electronAPI.getEmployeeName(employeePassword);
  },
};
