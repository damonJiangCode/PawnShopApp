import type { Ticket } from "../../../shared/types/Ticket";
import { getElectronApi } from "./electronApi";
import { extractBackendFieldError } from "../utils/formError";

export type TicketFormField =
  | "description"
  | "location"
  | "amount"
  | "employee_password";

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

export type CreatePawnTicketInput = {
  description: string;
  is_lost: boolean;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
  client_number: number;
};

export type CreateSellTicketInput = {
  description: string;
  location: string;
  amount: number;
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

type NormalizedCreatePawnTicketInput = {
  description: string;
  is_lost: boolean;
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
  is_lost: Boolean(input.is_lost),
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
      if (!api?.loadByClient) {
        return [];
      }

      return (await api.loadByClient(clientNumber)) as Ticket[];
    } catch {
      return [];
    }
  },

  loadLocations: async (): Promise<string[]> => {
    const api = getElectronApi()?.ticket;
    if (!api?.loadLocations) {
      return [];
    }

    try {
      return (await api.loadLocations()) as string[];
    } catch {
      return [];
    }
  },

  createPawnTicket: async (input: CreatePawnTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreatePawnTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api?.createPawn) {
      throw new Error(
        "[ticketService] createPawnTicket(): Cannot get api from Electron",
      );
    }

    try {
      return (await api.createPawn(normalizedInput)) as Ticket;
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  createSellTicket: async (input: CreateSellTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreateSellTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api?.createSell) {
      throw new Error(
        "[ticketService] createSellTicket(): Cannot get api from Electron",
      );
    }

    try {
      return (await api.createSell(normalizedInput)) as Ticket;
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  updateTicket: async (input: UpdateTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeUpdateTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api?.update) {
      throw new Error(
        "[ticketService] updateTicket(): Cannot get api from Electron",
      );
    }

    try {
      return (await api.update(normalizedInput)) as Ticket;
    } catch (error) {
      throw mapBackendError(error);
    }
  },
};
