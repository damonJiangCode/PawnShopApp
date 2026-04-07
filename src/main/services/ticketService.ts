import type { Ticket } from "../../shared/types/Ticket.ts";
import { calculation } from "../../shared/utils/calculation.ts";
import type {
  CreatePawnTicketInput,
  CreateSellTicketInput,
  UpdateTicketInput,
} from "../../shared/ipc/contracts.ts";
import { ticketRepo } from "../repos/ticketRepo.ts";
import { employeeService } from "./employeeService.ts";
import { createFieldError } from "../utils/createFieldError.ts";
import { runInTransaction } from "../utils/runInTransaction.ts";

const normalizeCreatePawnTicketInput = (input: CreatePawnTicketInput) => ({
  description: input.description.trim(),
  is_lost: Boolean(input.is_lost),
  location: input.location.trim(),
  amount: Number(input.amount),
  onetime_fee: Number.isFinite(input.onetime_fee)
    ? Math.max(0, input.onetime_fee)
    : 0,
  employee_password: input.employee_password.trim(),
  client_number: input.client_number,
});

const normalizeCreateSellTicketInput = (input: CreateSellTicketInput) => ({
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  employee_password: input.employee_password.trim(),
  client_number: input.client_number,
});

const normalizeUpdateTicketInput = (input: UpdateTicketInput) => ({
  ticket_number: input.ticket_number,
  is_lost: Boolean(input.is_lost),
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  onetime_fee: Number.isFinite(input.onetime_fee)
    ? Math.max(0, input.onetime_fee)
    : 0,
  employee_password: input.employee_password.trim(),
});

const resolveIsOverdue = (dueDate: Date) => dueDate.getTime() < Date.now();

export const ticketService = {
  loadTickets: async (clientNumber: number): Promise<Ticket[]> => {
    if (!clientNumber) {
      return [];
    }

    return ticketRepo.loadByClientNumber(clientNumber);
  },

  loadLocations: async (): Promise<string[]> => {
    return ticketRepo.loadLocations();
  },

  createPawnTicket: async (input: CreatePawnTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreatePawnTicketInput(input);

    return runInTransaction("createPawnTicket", async (client) => {
      const transactionDatetime = calculation.getCurrentDatetime();
      const dueDate = calculation.getDueDatetime(transactionDatetime);
      const employeeName =
        await employeeService.getEmployeeFirstNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      return ticketRepo.create(
        {
          transaction_datetime: transactionDatetime,
          is_lost: normalizedInput.is_lost,
          location: normalizedInput.location,
          description: normalizedInput.description,
          due_date: dueDate,
          is_overdue: resolveIsOverdue(dueDate),
          amount: normalizedInput.amount,
          onetime_fee: normalizedInput.onetime_fee,
          interest: calculation.getIntAmt(normalizedInput.amount),
          pickup_amount: calculation.getPickupAmt(
            normalizedInput.amount,
            normalizedInput.onetime_fee,
          ),
          employee_name: employeeName,
          status: "pawned",
          client_number: normalizedInput.client_number,
        },
        client,
      );
    });
  },

  createSellTicket: async (input: CreateSellTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreateSellTicketInput(input);

    return runInTransaction("createSellTicket", async (client) => {
      const transactionDatetime = calculation.getCurrentDatetime();
      const employeeName =
        await employeeService.getEmployeeFirstNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      return ticketRepo.create(
        {
          transaction_datetime: transactionDatetime,
          is_lost: false,
          location: normalizedInput.location,
          description: normalizedInput.description,
          due_date: transactionDatetime,
          is_overdue: false,
          amount: normalizedInput.amount,
          onetime_fee: 0,
          interest: 0,
          pickup_amount: 0,
          employee_name: employeeName,
          status: "sold",
          client_number: normalizedInput.client_number,
        },
        client,
      );
    });
  },

  updateTicket: async (input: UpdateTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeUpdateTicketInput(input);

    return runInTransaction("updateTicket", async (client) => {
      const employeeName =
        await employeeService.getEmployeeFirstNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      return ticketRepo.update(
        {
          ticket_number: normalizedInput.ticket_number,
          is_lost: normalizedInput.is_lost,
          description: normalizedInput.description,
          location: normalizedInput.location,
          amount: normalizedInput.amount,
          onetime_fee: normalizedInput.onetime_fee,
          interest: calculation.getIntAmt(normalizedInput.amount),
          pickup_amount: calculation.getPickupAmt(
            normalizedInput.amount,
            normalizedInput.onetime_fee,
          ),
          employee_name: employeeName,
        },
        client,
      );
    });
  },
};
