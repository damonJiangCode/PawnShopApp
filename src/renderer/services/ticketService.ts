import type { Ticket } from "../../shared/types/Ticket";
import type {
  HolidayDate,
  SaveHolidayInput,
} from "../../shared/types/holidayDate";
import type { Location, SaveLocationInput } from "../../shared/types/location";
import type {
  ConvertTicketInput,
  BuybackReportInput,
  BuybackReportResult,
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
} from "../../shared/types/ticketPayload";
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
  partial_payment: number;
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

type NormalizedExpireTicketInput = {
  ticket_number: number;
  employee_password?: string;
};

type NormalizedMarkTicketStolenInput = {
  ticket_number: number;
  employee_password: string;
};

type NormalizedPickupTicketsInput = {
  ticket_numbers: number[];
};

type NormalizedExtendTicketsInput = {
  extensions: Array<{
    ticket_number: number;
    months: number;
  }>;
};

type NormalizedBuybackReportInput = {
  date: string;
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
  partial_payment: Number.isFinite(input.partial_payment)
    ? Math.max(0, input.partial_payment)
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

const normalizeExpireTicketInput = (
  input: ExpireTicketInput,
): NormalizedExpireTicketInput => ({
  ticket_number: Number(input.ticket_number),
  employee_password: input.employee_password?.trim(),
});

const normalizeMarkTicketStolenInput = (
  input: MarkTicketStolenInput,
): NormalizedMarkTicketStolenInput => ({
  ticket_number: Number(input.ticket_number),
  employee_password: input.employee_password.trim(),
});

const normalizePickupTicketsInput = (
  input: PickupTicketsInput,
): NormalizedPickupTicketsInput => ({
  ticket_numbers: [...new Set(input.ticket_numbers.map(Number))].filter(
    (ticketNumber) => Number.isFinite(ticketNumber) && ticketNumber > 0,
  ),
});

const normalizeExtendTicketsInput = (
  input: ExtendTicketsInput,
): NormalizedExtendTicketsInput => ({
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

const normalizeBuybackReportInput = (
  input: BuybackReportInput,
): NormalizedBuybackReportInput => ({
  date: input.date.trim(),
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

  loadHolidayDates: async (): Promise<HolidayDate[]> => {
    const api = getElectronApi()?.ticket;
    if (!api) {
      return [];
    }

    try {
      return await api.loadHolidayDates();
    } catch {
      return [];
    }
  },

  addHolidayDate: async (input: SaveHolidayInput): Promise<HolidayDate> => {
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error("Holiday API is unavailable.");
    }

    return api.addHolidayDate({
      holiday_date: input.holiday_date.trim(),
      name: input.name.trim(),
    });
  },

  deleteHolidayDate: async (holidayDate: string): Promise<HolidayDate> => {
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error("Holiday API is unavailable.");
    }

    return api.deleteHolidayDate(holidayDate.trim());
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

  loadAdminLocations: async (): Promise<Location[]> => {
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error("Location API is unavailable.");
    }

    return api.loadAdminLocations();
  },

  addLocation: async (input: SaveLocationInput): Promise<Location> => {
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error("Location API is unavailable.");
    }

    return api.addLocation({
      location: input.location.trim().toUpperCase(),
      description: input.description.trim(),
    });
  },

  deactivateLocation: async (location: string): Promise<Location> => {
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error("Location API is unavailable.");
    }

    return api.deactivateLocation(location.trim().toUpperCase());
  },

  searchPaymentTicket: async (
    ticketNumber: number,
  ): Promise<PaymentTicketSearchPreview | null> => {
    const normalizedTicketNumber = Number(ticketNumber);
    const api = getElectronApi()?.ticket;

    if (
      !api ||
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      return null;
    }

    try {
      return await api.searchPaymentTicket(normalizedTicketNumber);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  searchTicket: async (
    ticketNumber: number,
  ): Promise<TicketSearchResult | null> => {
    const normalizedTicketNumber = Number(ticketNumber);
    const api = getElectronApi()?.ticket;

    if (
      !api ||
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      return null;
    }

    try {
      return await api.searchTicket(normalizedTicketNumber);
    } catch (error) {
      throw mapBackendError(error);
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

  expireTicket: async (input: ExpireTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeExpireTicketInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] expireTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.expire(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  markTicketStolen: async (input: MarkTicketStolenInput): Promise<Ticket> => {
    const normalizedInput = normalizeMarkTicketStolenInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] markTicketStolen(): Cannot get api from Electron",
      );
    }

    try {
      return await api.markStolen(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  pickupTickets: async (input: PickupTicketsInput): Promise<Ticket[]> => {
    const normalizedInput = normalizePickupTicketsInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] pickupTickets(): Cannot get api from Electron",
      );
    }

    if (!normalizedInput.ticket_numbers.length) {
      return [];
    }

    try {
      return await api.pickup(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  extendTickets: async (input: ExtendTicketsInput): Promise<Ticket[]> => {
    const normalizedInput = normalizeExtendTicketsInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] extendTickets(): Cannot get api from Electron",
      );
    }

    if (!normalizedInput.extensions.length) {
      return [];
    }

    try {
      return await api.extend(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  loadBuybackReport: async (
    input: BuybackReportInput,
  ): Promise<BuybackReportResult> => {
    const normalizedInput = normalizeBuybackReportInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] loadBuybackReport(): Cannot get api from Electron",
      );
    }

    try {
      return await api.loadBuybackReport(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  loadTransferTicketPreview: async (
    ticketNumber: number,
  ): Promise<TransferTicketPreview | null> => {
    const normalizedTicketNumber = Number(ticketNumber);
    const api = getElectronApi()?.ticket;

    if (
      !api ||
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
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
  BuybackReportInput,
  BuybackReportResult,
  ExtendTicketsInput,
  ExpireTicketInput,
  MarkTicketStolenInput,
  PaymentTicketSearchPreview,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
};
