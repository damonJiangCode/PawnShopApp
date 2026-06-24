import type { Ticket } from "../../shared/types/Ticket";
import type {
  HolidayDate,
  SaveHolidayInput,
} from "../../shared/types/holidayDate";
import type { Location, SaveLocationInput } from "../../shared/types/location";
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

const trimText = (value?: string) => value?.trim() ?? "";

const toNumber = (value: unknown) => Number(value);

const toNonNegativeNumber = (value: unknown, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.max(0, numberValue) : fallback;
};

const normalizeCreatePawnTicketInput = (
  input: CreatePawnTicketInput,
): CreatePawnTicketInput => ({
  ...input,
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toNonNegativeNumber(input.onetime_fee),
  employee_password: trimText(input.employee_password),
});

const normalizeCreateSellTicketInput = (
  input: CreateSellTicketInput,
): CreateSellTicketInput => ({
  ...input,
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  employee_password: trimText(input.employee_password),
});

const normalizeUpdateTicketInput = (
  input: UpdateTicketInput,
): UpdateTicketInput => ({
  ticket_number: input.ticket_number,
  is_lost: Boolean(input.is_lost),
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toNonNegativeNumber(input.onetime_fee),
  partial_payment: toNonNegativeNumber(input.partial_payment),
  employee_password: trimText(input.employee_password),
});

const normalizeTransferTicketInput = (
  input: TransferTicketInput,
): TransferTicketInput => ({
  ticket_number: toNumber(input.ticket_number),
  client_number: toNumber(input.client_number),
});

const normalizeConvertTicketInput = (
  input: ConvertTicketInput,
): ConvertTicketInput => ({
  ticket_number: toNumber(input.ticket_number),
  target_status: input.target_status,
  description: trimText(input.description),
  location: trimText(input.location),
  amount: toNumber(input.amount),
  onetime_fee: toNonNegativeNumber(input.onetime_fee),
  employee_password: trimText(input.employee_password),
});

const normalizeExpireTicketInput = (
  input: ExpireTicketInput,
): ExpireTicketInput => ({
  ticket_number: toNumber(input.ticket_number),
  employee_password:
    input.employee_password === undefined
      ? undefined
      : trimText(input.employee_password),
});

const normalizeMarkTicketStolenInput = (
  input: MarkTicketStolenInput,
): MarkTicketStolenInput => ({
  ticket_number: toNumber(input.ticket_number),
  employee_password: trimText(input.employee_password),
});

const normalizePickupTicketsInput = (
  input: PickupTicketsInput,
): PickupTicketsInput => ({
  ticket_numbers: [...new Set(input.ticket_numbers.map(Number))].filter(
    (ticketNumber) => Number.isFinite(ticketNumber) && ticketNumber > 0,
  ),
});

const normalizeExtendTicketsInput = (
  input: ExtendTicketsInput,
): ExtendTicketsInput => ({
  extensions: input.extensions
    .map((extension) => ({
      ticket_number: toNumber(extension.ticket_number),
      months: Math.floor(toNumber(extension.months)),
    }))
    .filter(
      (extension) =>
        Number.isFinite(extension.ticket_number) &&
        extension.ticket_number > 0 &&
        Number.isFinite(extension.months) &&
        extension.months > 0,
    ),
});

const normalizeReportDateInput = (input: ReportDateInput): ReportDateInput => ({
  date: trimText(input.date),
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
    input: ReportDateInput,
  ): Promise<BuybackReportResult> => {
    const normalizedInput = normalizeReportDateInput(input);
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

  loadInterestReport: async (
    input: ReportDateInput,
  ): Promise<InterestReportResult> => {
    const normalizedInput = normalizeReportDateInput(input);
    const api = getElectronApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] loadInterestReport(): Cannot get api from Electron",
      );
    }

    try {
      return await api.loadInterestReport(normalizedInput);
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
  BuybackReportResult,
  ExtendTicketsInput,
  ExpireTicketInput,
  InterestReportResult,
  MarkTicketStolenInput,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  ReportDateInput,
  TransferTicketInput,
  TransferTicketPreview,
  UpdateTicketInput,
};
