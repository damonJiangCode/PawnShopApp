import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";
import { calculation } from "../../../shared/utils/calculation";

const getElectronApi = () => (window as any).electronAPI;

type CreateTicketPayload = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_name: string;
  client_number: number;
};

export const transactionService = {
  loadTickets: async (clientNumber?: number): Promise<Ticket[]> => {
    try {
      if (!clientNumber) return [];
      const api = getElectronApi();
      if (!api?.getTickets) return [];
      return await api.getTickets(clientNumber);
    } catch {
      return [];
    }
  },

  loadItems: async (ticketNumber?: number): Promise<Item[]> => {
    try {
      if (!ticketNumber) return [];
      const api = getElectronApi();
      if (!api?.getItems) return [];
      return await api.getItems(ticketNumber);
    } catch {
      return [];
    }
  },

  getEmployeeName: async (employeePassword: string): Promise<string | null> => {
    if (employeePassword === null || employeePassword.length === 0) {
      throw new Error(
        "[transactionService] getEmployeeName(): Cannot process employeePassword",
      );
    }
    const api = getElectronApi();
    if (!api?.getEmployeeName) {
      throw new Error(
        "[transactionService] getEmployeeName(): Cannot get api from Electron",
      );
    }
    return await api.getEmployeeName(employeePassword);
  },

  addTicket: async (
    ticketData: CreateTicketPayload,
  ): Promise<Ticket | null> => {
    const interest = calculation.getIntAmt(ticketData.amount);
    const pickupAmt = calculation.getPickupAmt(ticketData.amount);
    const status = "pawned";
    const transactionDatetime = calculation.getCurrentDatetime();
    const dueDate = calculation.getDueDatetime(transactionDatetime);

    const api = getElectronApi();
    if (!api?.addTicket) {
      throw new Error(
        "[transactionService] addTicket(): Cannot get api from Electron",
      );
    }

    return await api.addTicket({
      ...ticketData,
      interest: interest,
      pickup_amount: pickupAmt,
      status: status,
      transaction_datetime: transactionDatetime,
      due_date: dueDate,
    });
  },
};
