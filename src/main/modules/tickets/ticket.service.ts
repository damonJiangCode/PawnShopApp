import type { Ticket } from "../../../shared/models/ticket.model.ts";
import { calculation } from "../../../shared/utils/calculation.ts";
import type {
  ConvertTicketInput,
  ExpireTicketInput,
  MarkTicketStolenInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TicketSearchResult,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
} from "../../../shared/payload-contracts/ticket.contract.ts";
import { clientRepo } from "../clients/client.repo.ts";
import { ticketRepo } from "./ticket.repo.ts";
import { employeeService } from "../employees/employee.service.ts";
import { ticketInput } from "./ticket.input.ts";
import { createFieldError } from "../../shared/createFieldError.ts";
import { runInTransaction } from "../../shared/runInTransaction.ts";
import { getDatabaseNow } from "../../database/connection.ts";
import { interestPaymentRepo } from "./interest-payment.repo.ts";

export const ticketService = {
  loadTickets: async (clientNumber: number): Promise<Ticket[]> => {
    if (!clientNumber) {
      return [];
    }

    return ticketRepo.loadByClientNumber(clientNumber);
  },

  searchTicketByNumber: async (
    ticketNumber: number,
  ): Promise<TicketSearchResult | null> => {
    const normalizedTicketNumber = Number(ticketNumber);

    if (
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      throw createFieldError("ticket_number", "Enter a valid ticket number.");
    }

    const ticket = await ticketRepo.loadByTicketNumber(normalizedTicketNumber);

    if (!ticket) {
      return null;
    }

    const client = await clientRepo.loadByNumber(ticket.client_number);

    if (!client) {
      return null;
    }

    return { ticket, client };
  },

  searchPaymentTicketByNumber: async (
    ticketNumber: number,
  ): Promise<TicketSearchResult | null> => {
    return ticketService.searchTicketByNumber(ticketNumber);
  },

  loadTransferTicketPreview: async (
    ticketNumber: number,
  ): Promise<TransferTicketPreview | null> => {
    const normalizedTicketNumber = Number(ticketNumber);

    if (
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      throw createFieldError("ticket_number", "Enter a valid ticket number.");
    }

    return ticketRepo.loadTransferTicketPreview(normalizedTicketNumber);
  },

  createPawnTicket: async (input: CreatePawnTicketInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeCreatePawnTicket(input);
    ticketInput.validateCreatePawnTicket(normalizedInput);

    return runInTransaction("createPawnTicket", async (client) => {
      const transactionDatetime = await getDatabaseNow(client);
      const dueDate = calculation.getDueDatetime(transactionDatetime);
      const employeeName =
        await employeeService.getEmployeeDisplayNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      if (
        !(await clientRepo.loadByNumber(normalizedInput.client_number, client))
      ) {
        throw createFieldError("client", "Client was not found.");
      }

      const newTicket = await ticketRepo.create(
        {
          transaction_datetime: transactionDatetime,
          is_lost: false,
          location: normalizedInput.location,
          description: normalizedInput.description,
          due_date: dueDate,
          amount: normalizedInput.amount,
          onetime_fee: normalizedInput.onetime_fee,
          employee_name: employeeName,
          status: "pawned",
          client_number: normalizedInput.client_number,
        },
        client,
      );

      return newTicket;
    });
  },

  createSellTicket: async (input: CreateSellTicketInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeCreateSellTicket(input);
    ticketInput.validateCreateSellTicket(normalizedInput);

    return runInTransaction("createSellTicket", async (client) => {
      const transactionDatetime = await getDatabaseNow(client);
      const employeeName =
        await employeeService.getEmployeeDisplayNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      if (
        !(await clientRepo.loadByNumber(normalizedInput.client_number, client))
      ) {
        throw createFieldError("client", "Client was not found.");
      }

      const newTicket = await ticketRepo.create(
        {
          transaction_datetime: transactionDatetime,
          is_lost: false,
          location: normalizedInput.location,
          description: normalizedInput.description,
          due_date: calculation.getSellDueDatetime(transactionDatetime),
          amount: normalizedInput.amount,
          onetime_fee: 0,
          employee_name: employeeName,
          status: "sold",
          client_number: normalizedInput.client_number,
        },
        client,
      );

      await clientRepo.incrementSellCount(
        normalizedInput.client_number,
        client,
      );

      return newTicket;
    });
  },

  updateTicket: async (input: UpdateTicketInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeUpdateTicket(input);
    ticketInput.validateUpdateTicket(normalizedInput);

    return runInTransaction("updateTicket", async (client) => {
      const employeeName =
        await employeeService.getEmployeeDisplayNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      const existingTicket = await ticketRepo.loadByTicketNumberForUpdate(
        normalizedInput.ticket_number,
        client,
      );

      if (!existingTicket) {
        throw createFieldError("ticket_number", "Ticket was not found.");
      }

      if (
        existingTicket.status !== "pawned" &&
        existingTicket.status !== "sold"
      ) {
        throw createFieldError(
          "ticket_number",
          "Only active pawned or sold tickets can be edited.",
        );
      }

      const amountChanged =
        normalizedInput.amount !== Number(existingTicket.amount);
      const databaseNow = await getDatabaseNow(client);
      const pawnTicketOverdue =
        existingTicket.status.startsWith("pawned") &&
        calculation.isBeforeCalendarDate(existingTicket.due_date, databaseNow);

      if (amountChanged && pawnTicketOverdue) {
        throw createFieldError(
          "amount",
          "This ticket is overdue. Its amount cannot be changed.",
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
          partial_payment: normalizedInput.partial_payment,
          employee_name: employeeName,
        },
        client,
      );
    });
  },

  convertTicket: async (input: ConvertTicketInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeConvertTicket(input);
    ticketInput.validateConvertTicket(normalizedInput);

    return runInTransaction("convertTicket", async (client) => {
      const employeeName =
        await employeeService.getEmployeeDisplayNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      const existingTicket = await ticketRepo.loadByTicketNumberForUpdate(
        normalizedInput.ticket_number,
        client,
      );

      if (!existingTicket) {
        throw createFieldError(
          "ticket_number",
          "No ticket was found for that ticket number.",
        );
      }

      if (
        existingTicket.status !== "pawned" &&
        existingTicket.status !== "sold"
      ) {
        throw createFieldError(
          "ticket_number",
          "Only pawned or sold tickets can be converted.",
        );
      }

      if (existingTicket.status === normalizedInput.target_status) {
        throw createFieldError(
          "ticket_number",
          "This ticket is already in the selected target status.",
        );
      }
      const interestSummary = (
        await interestPaymentRepo.loadSummaries(
          [normalizedInput.ticket_number],
          client,
        )
      ).get(normalizedInput.ticket_number);

      if (
        existingTicket.interest_paid_months > 0 ||
        (interestSummary?.monthsPaid ?? 0) > 0
      ) {
        throw createFieldError(
          "ticket_number",
          "A ticket with interest payments cannot be converted.",
        );
      }

      const conversionDatetime = await getDatabaseNow(client);
      const dueDate =
        normalizedInput.target_status === "pawned"
          ? calculation.getDueDatetime(conversionDatetime)
          : calculation.getSellDueDatetime(conversionDatetime);
      const onetimeFee =
        normalizedInput.target_status === "pawned"
          ? normalizedInput.onetime_fee
          : 0;

      const convertedTicket = await ticketRepo.convert(
        {
          ticket_number: normalizedInput.ticket_number,
          current_status: existingTicket.status,
          status: normalizedInput.target_status,
          transaction_datetime: conversionDatetime,
          description: normalizedInput.description,
          location: normalizedInput.location,
          amount: normalizedInput.amount,
          due_date: dueDate,
          onetime_fee: onetimeFee,
          employee_name: employeeName,
        },
        client,
      );

      if (existingTicket.status === "sold") {
        await clientRepo.decrementSellCount(
          existingTicket.client_number,
          client,
        );
      } else {
        await clientRepo.incrementSellCount(
          existingTicket.client_number,
          client,
        );
      }

      return convertedTicket;
    });
  },

  expireTicket: async (input: ExpireTicketInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeExpireTicket(input);

    return runInTransaction("expireTicket", async (client) => {
      if (
        !Number.isFinite(normalizedInput.ticket_number) ||
        normalizedInput.ticket_number <= 0
      ) {
        throw createFieldError("ticket_number", "Enter a valid ticket number.");
      }

      const existingTicket = await ticketRepo.loadByTicketNumberForUpdate(
        normalizedInput.ticket_number,
        client,
      );

      if (!existingTicket) {
        throw createFieldError(
          "ticket_number",
          "No ticket was found for that ticket number.",
        );
      }

      if (
        existingTicket.status !== "pawned" &&
        existingTicket.status !== "sold"
      ) {
        throw createFieldError(
          "ticket_number",
          "Only pawned or sold tickets can be expired.",
        );
      }

      const databaseNow = await getDatabaseNow(client);

      if (
        !calculation.isBeforeCalendarDate(existingTicket.due_date, databaseNow)
      ) {
        throw createFieldError(
          "ticket_number",
          "Only tickets past the due date can be expired.",
        );
      }

      if (normalizedInput.employee_password !== undefined) {
        const employeeName =
          await employeeService.getEmployeeDisplayNameByPassword(
            normalizedInput.employee_password,
            client,
          );

        if (!employeeName) {
          throw createFieldError(
            "employee_password",
            "Employee password is incorrect.",
          );
        }
      }

      const expiredStatus =
        existingTicket.status === "sold" ? "sold_expired" : "pawned_expired";

      const expiredTicket = await ticketRepo.expire(
        {
          ticket_number: normalizedInput.ticket_number,
          current_status: existingTicket.status,
          current_due_date: existingTicket.due_date,
          status: expiredStatus,
        },
        client,
      );

      if (expiredTicket.status === "pawned_expired") {
        await clientRepo.incrementExpireCount(
          expiredTicket.client_number,
          client,
        );
      }

      return expiredTicket;
    });
  },

  markTicketStolen: async (input: MarkTicketStolenInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeMarkTicketStolen(input);

    return runInTransaction("markTicketStolen", async (client) => {
      if (
        !Number.isFinite(normalizedInput.ticket_number) ||
        normalizedInput.ticket_number <= 0
      ) {
        throw createFieldError("ticket_number", "Enter a valid ticket number.");
      }

      if (!normalizedInput.employee_password) {
        throw createFieldError("employee_password", "Enter employee password.");
      }

      const employeeName =
        await employeeService.getEmployeeDisplayNameByPassword(
          normalizedInput.employee_password,
          client,
        );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      const existingTicket = await ticketRepo.loadByTicketNumberForUpdate(
        normalizedInput.ticket_number,
        client,
      );

      if (!existingTicket) {
        throw createFieldError(
          "ticket_number",
          "No ticket was found for that ticket number.",
        );
      }

      if (existingTicket.status !== "pawned") {
        throw createFieldError(
          "ticket_number",
          "Only an active pawned ticket can be marked stolen.",
        );
      }

      return ticketRepo.markStolen(
        {
          ticket_number: normalizedInput.ticket_number,
        },
        client,
      );
    });
  },

  transferTicket: async (input: TransferTicketInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeTransferTicket(input);

    return runInTransaction("transferTicket", async (client) => {
      if (
        !Number.isFinite(normalizedInput.ticket_number) ||
        normalizedInput.ticket_number <= 0
      ) {
        throw createFieldError("ticket_number", "Enter a valid ticket number.");
      }

      if (
        !Number.isFinite(normalizedInput.client_number) ||
        normalizedInput.client_number <= 0
      ) {
        throw createFieldError(
          "client",
          "A client is required to transfer a ticket.",
        );
      }

      const existingTicket = await ticketRepo.loadByTicketNumberForUpdate(
        normalizedInput.ticket_number,
        client,
      );

      if (!existingTicket) {
        throw createFieldError(
          "ticket_number",
          "No ticket was found for that ticket number.",
        );
      }

      if (
        existingTicket.status !== "pawned" &&
        existingTicket.status !== "sold"
      ) {
        throw createFieldError(
          "ticket_number",
          "Only pawned or sold tickets can be transferred.",
        );
      }

      if (existingTicket.client_number === normalizedInput.client_number) {
        throw createFieldError(
          "ticket_number",
          "This ticket already belongs to the selected client.",
        );
      }

      if (
        !(await clientRepo.loadByNumber(normalizedInput.client_number, client))
      ) {
        throw createFieldError("client", "The selected client was not found.");
      }

      const transferredTicket = await ticketRepo.transfer(
        normalizedInput.ticket_number,
        normalizedInput.client_number,
        client,
      );

      if (existingTicket.status === "sold") {
        await clientRepo.decrementSellCount(
          existingTicket.client_number,
          client,
        );
        await clientRepo.incrementSellCount(
          normalizedInput.client_number,
          client,
        );
      }

      return transferredTicket;
    });
  },
};
