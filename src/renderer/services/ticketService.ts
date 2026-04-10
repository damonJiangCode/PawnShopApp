import type { Ticket } from "../../shared/types/Ticket";
import type {
  ConvertTicketInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
} from "../../shared/ipc/ticketTypes";
import { getElectronApi } from "./electronApi";
import { extractBackendFieldError } from "../utils/formError";

export type TicketFormField =
  | "target_status"
  | "description"
  | "location"
  | "amount"
  | "onetime_fee"
  | "employee_password"
  | "ticket_number";

export type TicketFormError = Error & {
  field?: TicketFormField;
};

const createFieldError = (
  field: TicketFormField,
  message: string,
): TicketFormError => {
  const error = new Error(message) as TicketFormError;
  error.field = field;
  return error;
};

type NormalizedCreatePawnTicketInput = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
  client_number: number;
};

type NormalizedCreateSellTicketInput = {
  description: string;
  location: string;
  amount: number;
  employee_password: string;
  client_number: number;
};

type NormalizedUpdateTicketInput = {
  ticket_number: number;
  is_lost: boolean;
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

type NormalizedTransferTicketInput = {
  ticket_number: number;
  client_number: number;
};

type NormalizedConvertTicketInput = {
  ticket_number: number;
  target_status: "pawned" | "sold";
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

const normalizeCreatePawnTicketInput = (
  input: CreatePawnTicketInput,
): NormalizedCreatePawnTicketInput => ({
  ...input,
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  onetime_fee: Number.isFinite(input.onetime_fee)
    ? Math.max(0, input.onetime_fee)
    : 0,
  employee_password: input.employee_password.trim(),
});

const normalizeCreateSellTicketInput = (
  input: CreateSellTicketInput,
): NormalizedCreateSellTicketInput => ({
  ...input,
  description: input.description.trim(),
  location: input.location.trim(),
  amount: Number(input.amount),
  employee_password: input.employee_password.trim(),
});

const normalizeUpdateTicketInput = (
  input: UpdateTicketInput,
): NormalizedUpdateTicketInput => ({
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

const normalizeTransferTicketInput = (
  input: TransferTicketInput,
): NormalizedTransferTicketInput => ({
  ticket_number: Number(input.ticket_number),
  client_number: Number(input.client_number),
});

const normalizeConvertTicketInput = (
  input: ConvertTicketInput,
): NormalizedConvertTicketInput => ({
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

const mapBackendError = (error: unknown): Error => {
  if (!(error instanceof Error)) {
    return new Error("Unknown ticket error");
  }

  const backendFieldError = extractBackendFieldError(error.message);

  if (!backendFieldError) {
    return error;
  }

  return createFieldError(
    backendFieldError.field as TicketFormField,
    backendFieldError.message,
  );
};

export const ticketService = {
  loadTickets: async (clientNumber?: number): Promise<Ticket[]> => {
    try {
      if (!clientNumber) {
        return [];
      }

      const api = getElectronApi()?.ticket;
      if (!api) {
        return [];
      }

      return await api.loadByClient(clientNumber);
    } catch {
      return [];
    }
  },

  loadLocations: async (): Promise<string[]> => {
    const api = getElectronApi()?.ticket;
    if (!api) {
      return [];
    }

    try {
      return await api.loadLocations();
    } catch {
      return [];
    }
  },

  createPawnTicket: async (input: CreatePawnTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreatePawnTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] createPawnTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.createPawn(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  createSellTicket: async (input: CreateSellTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreateSellTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] createSellTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.createSell(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  updateTicket: async (input: UpdateTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeUpdateTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] updateTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.update(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  convertTicket: async (input: ConvertTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeConvertTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] convertTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.convert(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  loadTransferTicketPreview: async (
    ticketNumber: number,
  ): Promise<TransferTicketPreview | null> => {
    const normalizedTicketNumber = Number(ticketNumber);
    const api = getElectronApi()?.ticket;

    if (!api || !Number.isFinite(normalizedTicketNumber) || normalizedTicketNumber <= 0) {
      return null;
    }

    try {
      return await api.loadTransferPreview(normalizedTicketNumber);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  transferTicket: async (input: TransferTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeTransferTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] transferTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.transfer(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },
};

export type {
  ConvertTicketInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
};
