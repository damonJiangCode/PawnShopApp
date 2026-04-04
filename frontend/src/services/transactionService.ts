import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";

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

const FIELD_ERROR_PREFIX = "[field-error]";

export type AddTicketInput = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
  client_number: number;
};

export type UpdateTicketInput = {
  ticket_number: number;
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

type NormalizedAddTicketInput = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
  client_number: number;
};

type NormalizedUpdateTicketInput = {
  ticket_number: number;
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

const normalizeAddTicketInput = (
  input: AddTicketInput,
): NormalizedAddTicketInput => ({
  ...input,
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  onetime_fee: Number.isFinite(input.onetime_fee)
    ? Math.max(0, input.onetime_fee)
    : 0,
  employee_password: input.employee_password.trim(),
});

const normalizeUpdateTicketInput = (
  input: UpdateTicketInput,
): NormalizedUpdateTicketInput => ({
  ticket_number: input.ticket_number,
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  onetime_fee: Number.isFinite(input.onetime_fee)
    ? Math.max(0, input.onetime_fee)
    : 0,
  employee_password: input.employee_password.trim(),
});

const mapBackendError = (error: unknown): Error => {
  if (!(error instanceof Error)) {
    return new Error("Unknown transaction error");
  }

  if (!error.message.startsWith(FIELD_ERROR_PREFIX)) {
    return error;
  }

  const payload = error.message.slice(FIELD_ERROR_PREFIX.length);
  const separatorIndex = payload.indexOf(":");

  if (separatorIndex === -1) {
    return error;
  }

  const field = payload.slice(0, separatorIndex) as TicketFormField;
  const message = payload.slice(separatorIndex + 1).trim();
  return createFieldError(field, message || error.message);
};

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

  addTicket: async (
    input: AddTicketInput,
  ): Promise<Ticket> => {
    const normalizedInput = normalizeAddTicketInput(input);
    const api = getApi();

    if (!api?.addTicket) {
      throw new Error(
        "[transactionService] addTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.addTicket(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  editTicket: async (
    input: UpdateTicketInput,
  ): Promise<Ticket> => {
    const normalizedInput = normalizeUpdateTicketInput(input);
    const api = getApi();

    if (!api?.updateTicket) {
      throw new Error(
        "[transactionService] editTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.updateTicket(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },
};

export const {
  addTicket,
  editTicket,
  loadItems,
  loadTickets,
} = transactionService;
