import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";
import { transactionApi } from "../api/transactionApi";

type CreateTicketPayload = {
  description: string;
  location: string;
  amount: number;
  oneTimeFee: number;
  employeePassword: string;
  clientNumber: number;
};

export const transactionService = {
  loadTickets: async (clientNumber?: number): Promise<Ticket[]> => {
    try {
      if (!clientNumber) return [];
      return await transactionApi.getTickets(clientNumber);
    } catch {
      return [];
    }
  },

  loadItems: async (ticketNumber?: number): Promise<Item[]> => {
    try {
      if (!ticketNumber) return [];
      return await transactionApi.getItems(ticketNumber);
    } catch {
      return [];
    }
  },

  getEmployeeName: async (
    employeePassword?: string,
  ): Promise<string | null> => {
    try {
      if (!employeePassword || employeePassword.length === 0) return null;
      return await transactionApi.getEmployeeName(employeePassword);
    } catch {
      return null;
    }
  },

  addTicket: async (ticketData?: CreateTicketPayload): Promise<void> => {
    try {
      const interest = ticketData?.amount ? ticketData.amount * 0.3 : 0;
      const status = "pawned";
      const transaction_datetime = Date.now();
      const due_date = transaction_datetime + 30;
      const employee_name = "damon";

      return await transactionApi.addTicket({
        ...ticketData,
        interest: interest,
        status: status,
        transaction_datetime: transaction_datetime,
        due_date: due_date,
        employee_name: employee_name,
      });
    } catch {}
  },
};
