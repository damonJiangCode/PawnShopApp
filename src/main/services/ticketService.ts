import type { Ticket } from "../../shared/types/Ticket.ts";
import type { HolidayDate } from "../../shared/types/holidayDate.ts";
import { calculation } from "../../shared/utils/calculation.ts";
import type {
  ConvertTicketInput,
  ExtendTicketsInput,
  ExpireTicketInput,
  MarkTicketStolenInput,
  PaymentTicketSearchPreview,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TicketSearchResult,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
} from "../../shared/types/ticketPayload.ts";
import { clientRepo } from "../repos/clientRepo.ts";
import { ticketRepo } from "../repos/ticketRepo.ts";
import { employeeService } from "./employeeService.ts";
import { createFieldError } from "../utils/createFieldError.ts";
import { runInTransaction } from "../utils/runInTransaction.ts";

const normalizeCreatePawnTicketInput = (input: CreatePawnTicketInput) => ({
  description: input.description.trim(),
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
  partial_payment: Number.isFinite(input.partial_payment)
    ? Math.max(0, input.partial_payment)
    : 0,
  employee_password: input.employee_password.trim(),
});

const normalizeTransferTicketInput = (input: TransferTicketInput) => ({
  ticket_number: Number(input.ticket_number),
  client_number: Number(input.client_number),
});

const normalizeConvertTicketInput = (input: ConvertTicketInput) => ({
  ticket_number: Number(input.ticket_number),
  target_status: input.target_status,
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  onetime_fee: Number.isFinite(input.onetime_fee)
    ? Math.max(0, input.onetime_fee)
    : 0,
  employee_password: input.employee_password.trim(),
});

const normalizeExpireTicketInput = (input: ExpireTicketInput) => ({
  ticket_number: Number(input.ticket_number),
  employee_password: input.employee_password?.trim(),
});

const normalizeMarkTicketStolenInput = (input: MarkTicketStolenInput) => ({
  ticket_number: Number(input.ticket_number),
  employee_password: input.employee_password.trim(),
});

const normalizePickupTicketsInput = (input: PickupTicketsInput) => ({
  ticket_numbers: [...new Set(input.ticket_numbers.map(Number))].filter(
    (ticketNumber) => Number.isFinite(ticketNumber) && ticketNumber > 0,
  ),
});

const normalizeExtendTicketsInput = (input: ExtendTicketsInput) => ({
  extensions: input.extensions
    .map((extension) => ({
      ticket_number: Number(extension.ticket_number),
      months: Math.floor(Number(extension.months)),
    }))
    .filter(
      (extension) =>
        Number.isFinite(extension.ticket_number) &&
        extension.ticket_number > 0 &&
        Number.isFinite(extension.months) &&
        extension.months > 0,
    ),
});

export const ticketService = {
  loadTickets: async (clientNumber: number): Promise<Ticket[]> => {
    if (!clientNumber) {
      return [];
    }

    return ticketRepo.loadByClientNumber(clientNumber);
  },

  loadHolidayDates: async (): Promise<HolidayDate[]> => {
    return ticketRepo.loadHolidayDates();
  },

  loadLocations: async (): Promise<string[]> => {
    return ticketRepo.loadLocations();
  },

  searchTicket: async (
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

  searchPaymentTicket: async (
    ticketNumber: number,
  ): Promise<PaymentTicketSearchPreview | null> => {
    return ticketService.searchTicket(ticketNumber);
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
    const normalizedInput = normalizeCreatePawnTicketInput(input);

    return runInTransaction("createPawnTicket", async (client) => {
      const transactionDatetime = calculation.getCurrentDatetime();
      const dueDate = calculation.getDueDatetime(transactionDatetime);
      const employeeName = await employeeService.getEmployeeFirstNameByPassword(
        normalizedInput.employee_password,
        client,
      );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
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
    const normalizedInput = normalizeCreateSellTicketInput(input);

    return runInTransaction("createSellTicket", async (client) => {
      const transactionDatetime = calculation.getCurrentDatetime();
      const employeeName = await employeeService.getEmployeeFirstNameByPassword(
        normalizedInput.employee_password,
        client,
      );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
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

      await clientRepo.incrementSoldCount(
        normalizedInput.client_number,
        client,
      );

      return newTicket;
    });
  },

  updateTicket: async (input: UpdateTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeUpdateTicketInput(input);

    return runInTransaction("updateTicket", async (client) => {
      const employeeName = await employeeService.getEmployeeFirstNameByPassword(
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
          partial_payment: normalizedInput.partial_payment,
          employee_name: employeeName,
        },
        client,
      );
    });
  },

  convertTicket: async (input: ConvertTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeConvertTicketInput(input);

    return runInTransaction("convertTicket", async (client) => {
      if (
        !Number.isFinite(normalizedInput.ticket_number) ||
        normalizedInput.ticket_number <= 0
      ) {
        throw createFieldError("ticket_number", "Enter a valid ticket number.");
      }

      if (!normalizedInput.description) {
        throw createFieldError("description", "Description is required.");
      }

      if (!normalizedInput.location) {
        throw createFieldError("location", "Location is required.");
      }

      if (
        !Number.isFinite(normalizedInput.amount) ||
        normalizedInput.amount <= 0
      ) {
        throw createFieldError("amount", "Amount must be greater than 0.");
      }

      if (normalizedInput.onetime_fee < 0) {
        throw createFieldError(
          "onetime_fee",
          "One Time Fee cannot be negative.",
        );
      }

      const employeeName = await employeeService.getEmployeeFirstNameByPassword(
        normalizedInput.employee_password,
        client,
      );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      const existingTicket = await ticketRepo.loadByTicketNumber(
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

      const conversionDatetime = calculation.getCurrentDatetime();
      const dueDate =
        normalizedInput.target_status === "pawned"
          ? calculation.getDueDatetime(conversionDatetime)
          : calculation.getSellDueDatetime(conversionDatetime);
      const onetimeFee =
        normalizedInput.target_status === "pawned"
          ? normalizedInput.onetime_fee
          : 0;

      return ticketRepo.convert(
        {
          ticket_number: normalizedInput.ticket_number,
          status: normalizedInput.target_status,
          description: normalizedInput.description,
          location: normalizedInput.location,
          amount: normalizedInput.amount,
          due_date: dueDate,
          onetime_fee: onetimeFee,
          employee_name: employeeName,
        },
        client,
      );
    });
  },

  expireTicket: async (input: ExpireTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeExpireTicketInput(input);

    return runInTransaction("expireTicket", async (client) => {
      if (
        !Number.isFinite(normalizedInput.ticket_number) ||
        normalizedInput.ticket_number <= 0
      ) {
        throw createFieldError("ticket_number", "Enter a valid ticket number.");
      }

      const existingTicket = await ticketRepo.loadByTicketNumber(
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

      if (!calculation.isBeforeCalendarDate(existingTicket.due_date)) {
        throw createFieldError(
          "ticket_number",
          "Only tickets past the due date can be expired.",
        );
      }

      if (normalizedInput.employee_password !== undefined) {
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
      }

      const expiredStatus =
        existingTicket.status === "sold" ? "sell_expired" : "pawn_expired";

      const expiredTicket = await ticketRepo.expire(
        {
          ticket_number: normalizedInput.ticket_number,
          current_status: existingTicket.status,
          current_due_date: existingTicket.due_date,
          status: expiredStatus,
        },
        client,
      );

      await clientRepo.incrementExpireCount(
        expiredTicket.client_number,
        client,
      );

      return expiredTicket;
    });
  },

  markTicketStolen: async (input: MarkTicketStolenInput): Promise<Ticket> => {
    const normalizedInput = normalizeMarkTicketStolenInput(input);

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

      const employeeName = await employeeService.getEmployeeFirstNameByPassword(
        normalizedInput.employee_password,
        client,
      );

      if (!employeeName) {
        throw createFieldError(
          "employee_password",
          "Employee password is incorrect.",
        );
      }

      const existingTicket = await ticketRepo.loadByTicketNumber(
        normalizedInput.ticket_number,
        client,
      );

      if (!existingTicket) {
        throw createFieldError(
          "ticket_number",
          "No ticket was found for that ticket number.",
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

  pickupTickets: async (input: PickupTicketsInput): Promise<Ticket[]> => {
    const normalizedInput = normalizePickupTicketsInput(input);

    if (!normalizedInput.ticket_numbers.length) {
      throw createFieldError("ticket_number", "Select at least one ticket.");
    }

    return runInTransaction("pickupTickets", async (client) => {
      const existingTickets = await Promise.all(
        normalizedInput.ticket_numbers.map((ticketNumber) =>
          ticketRepo.loadByTicketNumber(ticketNumber, client),
        ),
      );
      const missingTicketNumber = normalizedInput.ticket_numbers.find(
        (_ticketNumber, index) => !existingTickets[index],
      );

      if (missingTicketNumber) {
        throw createFieldError(
          "ticket_number",
          `Ticket #${missingTicketNumber} was not found.`,
        );
      }

      const nonPawnedTicket = existingTickets.find(
        (ticket) => ticket && ticket.status !== "pawned",
      );

      if (nonPawnedTicket?.ticket_number) {
        throw createFieldError(
          "ticket_number",
          `Ticket #${nonPawnedTicket.ticket_number} is not pawned.`,
        );
      }

      const stolenTicket = existingTickets.find((ticket) => ticket?.is_stolen);

      if (stolenTicket?.ticket_number) {
        throw createFieldError(
          "ticket_number",
          `Ticket #${stolenTicket.ticket_number} is marked stolen.`,
        );
      }

      const pickupDatetime = calculation.getCurrentDatetime();
      const pickedUpTickets = await ticketRepo.pickup(
        {
          ticket_numbers: normalizedInput.ticket_numbers,
          pickup_datetime: pickupDatetime,
        },
        client,
      );

      if (pickedUpTickets.length !== normalizedInput.ticket_numbers.length) {
        throw createFieldError(
          "ticket_number",
          "Some selected tickets could not be picked up.",
        );
      }

      return pickedUpTickets;
    });
  },

  extendTickets: async (input: ExtendTicketsInput): Promise<Ticket[]> => {
    const normalizedInput = normalizeExtendTicketsInput(input);

    if (!normalizedInput.extensions.length) {
      throw createFieldError("ticket_number", "Select at least one ticket.");
    }

    return runInTransaction("extendTickets", async (client) => {
      const existingTickets = await Promise.all(
        normalizedInput.extensions.map((extension) =>
          ticketRepo.loadByTicketNumber(extension.ticket_number, client),
        ),
      );
      const missingExtension = normalizedInput.extensions.find(
        (_extension, index) => !existingTickets[index],
      );

      if (missingExtension) {
        throw createFieldError(
          "ticket_number",
          `Ticket #${missingExtension.ticket_number} was not found.`,
        );
      }

      const nonPawnedTicket = existingTickets.find(
        (ticket) => ticket && ticket.status !== "pawned",
      );

      if (nonPawnedTicket?.ticket_number) {
        throw createFieldError(
          "ticket_number",
          `Ticket #${nonPawnedTicket.ticket_number} is not pawned.`,
        );
      }

      const stolenTicket = existingTickets.find((ticket) => ticket?.is_stolen);

      if (stolenTicket?.ticket_number) {
        throw createFieldError(
          "ticket_number",
          `Ticket #${stolenTicket.ticket_number} is marked stolen.`,
        );
      }

      const interestedDatetime = calculation.getCurrentDatetime();
      const extendedTickets: Ticket[] = [];

      for (const extension of normalizedInput.extensions) {
        extendedTickets.push(
          await ticketRepo.extend(
            {
              ticket_number: extension.ticket_number,
              months: extension.months,
              interested_datetime: interestedDatetime,
            },
            client,
          ),
        );
      }

      return extendedTickets;
    });
  },

  transferTicket: async (input: TransferTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeTransferTicketInput(input);

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
        throw new Error("A client is required to transfer a ticket.");
      }

      const transferPreview = await ticketRepo.loadTransferTicketPreview(
        normalizedInput.ticket_number,
      );

      if (!transferPreview) {
        throw createFieldError(
          "ticket_number",
          "No ticket was found for that ticket number.",
        );
      }

      if (
        transferPreview.status !== "pawned" &&
        transferPreview.status !== "sold"
      ) {
        throw createFieldError(
          "ticket_number",
          "Only pawned or sold tickets can be transferred.",
        );
      }

      if (
        transferPreview.previous_client_number === normalizedInput.client_number
      ) {
        throw createFieldError(
          "ticket_number",
          "This ticket already belongs to the selected client.",
        );
      }

      return ticketRepo.transfer(
        normalizedInput.ticket_number,
        normalizedInput.client_number,
        client,
      );
    });
  },
};
