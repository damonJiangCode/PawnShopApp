import type { Ticket } from "../../shared/types/Ticket.ts";
import type {
  HolidayDate,
  SaveHolidayInput,
} from "../../shared/types/holidayDate.ts";
import type {
  Location,
  SaveLocationInput,
} from "../../shared/types/location.ts";
import { calculation } from "../../shared/utils/calculation.ts";
import type {
  ConvertTicketInput,
  BuybackReportResult,
  ExtendTicketsInput,
  ExpireTicketInput,
  InterestReportResult,
  MarkTicketStolenInput,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  ReportDateInput,
  TicketSearchResult,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
} from "../../shared/types/ticketPayload.ts";
import { clientRepo } from "../repos/clientRepo.ts";
import { ticketRepo } from "../repos/ticketRepo.ts";
import { employeeService } from "./employeeService.ts";
import { ticketInput } from "./inputs/ticketInput.ts";
import { createFieldError } from "../utils/createFieldError.ts";
import { runInTransaction } from "../utils/runInTransaction.ts";

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

  addHolidayDate: async (input: SaveHolidayInput): Promise<HolidayDate> => {
    const normalizedInput = {
      holiday_date: input?.holiday_date?.trim() ?? "",
      name: input?.name?.trim() ?? "",
    };

    if (!ticketInput.isValidDateKey(normalizedInput.holiday_date)) {
      throw new Error("Enter a valid holiday date.");
    }

    if (!normalizedInput.name) {
      throw new Error("Holiday name is required.");
    }

    const holiday = await ticketRepo.addHolidayDate(normalizedInput);

    if (!holiday) {
      throw new Error("That holiday date has already been added.");
    }

    return holiday;
  },

  deleteHolidayDate: async (holidayDate: string): Promise<HolidayDate> => {
    const normalizedDate = holidayDate?.trim() ?? "";

    if (!ticketInput.isValidDateKey(normalizedDate)) {
      throw new Error("Enter a valid holiday date.");
    }

    const holiday = await ticketRepo.deleteHolidayDate(normalizedDate);

    if (!holiday) {
      throw new Error("That holiday date was not found.");
    }

    return holiday;
  },

  loadLocations: async (): Promise<string[]> => {
    return ticketRepo.loadLocations();
  },

  loadAdminLocations: async (): Promise<Location[]> => {
    return ticketRepo.loadAdminLocations();
  },

  addLocation: async (input: SaveLocationInput): Promise<Location> => {
    const normalizedInput = {
      location: input?.location?.trim().toUpperCase() ?? "",
      description: input?.description?.trim() ?? "",
    };

    if (!/^[A-Z]{2}\d{2}$/.test(normalizedInput.location)) {
      throw new Error(
        "Location code must contain two uppercase letters followed by two digits.",
      );
    }

    if (normalizedInput.description.length > 1000) {
      throw new Error("Location description cannot exceed 1000 characters.");
    }

    const location = await ticketRepo.addLocation(normalizedInput);

    if (!location) {
      throw new Error("That location code already exists.");
    }

    return location;
  },

  deactivateLocation: async (locationCode: string): Promise<Location> => {
    const normalizedCode = locationCode?.trim().toUpperCase() ?? "";

    if (!normalizedCode) {
      throw new Error("Enter a valid location code.");
    }

    const location = await ticketRepo.deactivateLocation(normalizedCode);

    if (!location) {
      throw new Error("That active location was not found.");
    }

    return location;
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
  ): Promise<TicketSearchResult | null> => {
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

  loadBuybackReport: async (
    input: ReportDateInput,
  ): Promise<BuybackReportResult> => {
    const normalizedInput = ticketInput.normalizeReportDate(input);

    if (!ticketInput.isValidDateKey(normalizedInput.date)) {
      throw createFieldError("date", "Enter a valid report date.");
    }

    const sourceRows = await ticketRepo.loadBuybackReportRows(
      normalizedInput.date,
    );

    const rows = sourceRows.map((row) => {
      const pickupAmount = Math.max(
        0,
        calculation.getPaymentPickupAmt(
          row.amount,
          row.onetime_fee,
          row.transaction_datetime,
          row.interest_paid_months,
          row.pickup_datetime,
        ) - Number(row.partial_payment ?? 0),
      );

      return {
        ticket_number: row.ticket_number,
        pickup_datetime: row.pickup_datetime,
        amount: Number(pickupAmount.toFixed(2)),
        description: row.description,
        client_name: row.client_name,
      };
    });

    const total = rows.reduce((sum, row) => sum + row.amount, 0);

    return {
      date: normalizedInput.date,
      rows,
      total_buyback_price: Number(total.toFixed(2)),
    };
  },

  loadInterestReport: async (
    input: ReportDateInput,
  ): Promise<InterestReportResult> => {
    const normalizedInput = ticketInput.normalizeReportDate(input);

    if (!ticketInput.isValidDateKey(normalizedInput.date)) {
      throw createFieldError("date", "Enter a valid report date.");
    }

    const rows = await ticketRepo.loadInterestReportRows(normalizedInput.date);
    const total = rows.reduce((sum, row) => sum + row.amount_paid, 0);

    return {
      date: normalizedInput.date,
      rows,
      total_interest_paid: Number(total.toFixed(2)),
    };
  },

  createPawnTicket: async (input: CreatePawnTicketInput): Promise<Ticket> => {
    const normalizedInput = ticketInput.normalizeCreatePawnTicket(input);

    return runInTransaction("createPawnTicket", async (client) => {
      const transactionDatetime = calculation.getCurrentDatetime();
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

    return runInTransaction("createSellTicket", async (client) => {
      const transactionDatetime = calculation.getCurrentDatetime();
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
    const normalizedInput = ticketInput.normalizeUpdateTicket(input);

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
    const normalizedInput = ticketInput.normalizeExpireTicket(input);

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
    const normalizedInput = ticketInput.normalizePickupTickets(input);

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
    const normalizedInput = ticketInput.normalizeExtendTickets(input);

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
      const ticketByNumber = new Map(
        existingTickets
          .filter((ticket): ticket is Ticket => Boolean(ticket))
          .map((ticket) => [ticket.ticket_number, ticket]),
      );

      for (const extension of normalizedInput.extensions) {
        const extendedTicket = await ticketRepo.extend(
          {
            ticket_number: extension.ticket_number,
            months: extension.months,
            interested_datetime: interestedDatetime,
          },
          client,
        );
        const originalTicket = ticketByNumber.get(extension.ticket_number);
        const amountPaid =
          calculation.getBaseIntAmt(Number(originalTicket?.amount ?? 0)) *
          extension.months;

        await ticketRepo.addInterestPayment(
          {
            ticket_number: extension.ticket_number,
            months_paid: extension.months,
            amount_paid: Number(amountPaid.toFixed(2)),
            payment_datetime: interestedDatetime,
          },
          client,
        );

        extendedTickets.push(extendedTicket);
      }

      return extendedTickets;
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
