import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";
import { calculation } from "../../../shared/utils/calculation";

const getElectronApi = () => (window as any).electronAPI;
const getApi = getElectronApi;

export type TicketFormField =
  | "description"
  | "location"
  | "amount"
  | "employee_password";

export type FormFieldError = Error & {
  field?: TicketFormField;
};

export const createFieldError = (
  field: TicketFormField,
  message: string,
): FormFieldError => {
  const error = new Error(message) as FormFieldError;
  error.field = field;
  return error;
};

type AddTicketPayload = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_name: string;
  client_number: number;
};

type CreateTicketInput = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
  client_number: number;
};

type NormalizedCreateTicketInput = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
  client_number: number;
};

const normalizeCreateTicketInput = (
  input: CreateTicketInput,
): NormalizedCreateTicketInput => ({
  ...input,
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  onetime_fee: Number.isFinite(input.onetime_fee)
    ? Math.max(0, input.onetime_fee)
    : 0,
  employee_password: input.employee_password.trim(),
});

const buildAddTicketPayload = (
  input: Omit<NormalizedCreateTicketInput, "employee_password"> & {
    employee_name: string;
  },
): AddTicketPayload => ({
  description: input.description,
  location: input.location,
  amount: input.amount,
  onetime_fee: input.onetime_fee,
  employee_name: input.employee_name,
  client_number: input.client_number,
});

export const transactionService = {
  loadTickets: async (clientNumber?: number): Promise<Ticket[]> => {
    try {
      if (!clientNumber) return [];
      const api = getApi();
      if (!api?.getTickets) return [];
      return await api.getTickets(clientNumber);
    } catch {
      return [];
    }
  },

  loadItems: async (ticketNumber?: number): Promise<Item[]> => {
    try {
      if (!ticketNumber) return [];
      const api = getApi();
      if (!api?.getItems) return [];
      return await api.getItems(ticketNumber);
    } catch {
      return [];
    }
  },

  loadEmployeeNameByPassword: async (
    employeePassword: string,
  ): Promise<string | null> => {
    const safePassword = employeePassword?.trim() ?? "";

    if (!safePassword) {
      throw new Error(
        "[transactionService] loadEmployeeNameByPassword(): Cannot process employeePassword",
      );
    }

    const api = getApi();
    if (!api?.getEmployeeName) {
      throw new Error(
        "[transactionService] loadEmployeeNameByPassword(): Cannot get api from Electron",
      );
    }

    return await api.getEmployeeName(safePassword);
  },

  addTicket: async (
    payload: AddTicketPayload,
  ): Promise<Ticket | null> => {
    const interest = calculation.getIntAmt(payload.amount);
    const pickupAmt = calculation.getPickupAmt(
      payload.amount,
      payload.onetime_fee,
    );
    const status = "pawned";
    const transactionDatetime = calculation.getCurrentDatetime();
    const dueDate = calculation.getDueDatetime(transactionDatetime);

    const api = getApi();
    if (!api?.addTicket) {
      throw new Error(
        "[transactionService] addTicket(): Cannot get api from Electron",
      );
    }

    return await api.addTicket({
      ...payload,
      interest,
      pickup_amount: pickupAmt,
      status,
      transaction_datetime: transactionDatetime,
      due_date: dueDate,
    });
  },

  createTicket: async (
    input: CreateTicketInput,
  ): Promise<Ticket> => {
    const normalizedInput = normalizeCreateTicketInput(input);

    const employeeName = await transactionService.loadEmployeeNameByPassword(
      normalizedInput.employee_password,
    );

    if (!employeeName) {
      throw createFieldError(
        "employee_password",
        "Employee password is incorrect.",
      );
    }

    const { employee_password, ...rest } = normalizedInput;
    const newTicket = await transactionService.addTicket(
      buildAddTicketPayload({
        ...rest,
        employee_name: employeeName,
      }),
    );

    if (!newTicket) {
      throw new Error("Cannot add ticket!");
    }

    return newTicket;
  },
};

export const {
  addTicket,
  createTicket,
  loadEmployeeNameByPassword,
  loadItems,
  loadTickets,
} = transactionService;
