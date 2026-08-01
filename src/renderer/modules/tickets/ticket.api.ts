import type { Ticket } from "../../../shared/models/ticket.model";
import type { HolidayDate } from "../../../shared/models/holiday-date.model";
import type { Location } from "../../../shared/models/location.model";
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
  SaveHolidayInput,
  SaveLocationInput,
} from "../../../shared/payload-contracts/ticket.contract";
import { getAppApi } from "../../shared/api/app.api";
import {
  mapBackendError,
  normalizeConvertTicketInput,
  normalizeCreatePawnTicketInput,
  normalizeCreateSellTicketInput,
  normalizeExpireTicketInput,
  normalizeExtendTicketsInput,
  normalizeMarkTicketStolenInput,
  normalizePickupTicketsInput,
  normalizeReportDateInput,
  normalizeTransferTicketInput,
  normalizeUpdateTicketInput,
} from "./ticketApiUtils";

export const ticketService = {
  loadTickets: async (clientNumber?: number): Promise<Ticket[]> => {
    try {
      if (!clientNumber) {
        return [];
      }

      const api = getAppApi()?.ticket;
      if (!api) {
        return [];
      }

      return await api.loadTicketsByClient(clientNumber);
    } catch {
      return [];
    }
  },

  loadHolidayDates: async (): Promise<HolidayDate[]> => {
    const api = getAppApi()?.ticket;
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
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error("Holiday API is unavailable.");
    }

    return api.addHolidayDate({
      holiday_date: input.holiday_date.trim(),
      name: input.name.trim(),
    });
  },

  deleteHolidayDate: async (holidayDate: string): Promise<HolidayDate> => {
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error("Holiday API is unavailable.");
    }

    return api.deleteHolidayDate(holidayDate.trim());
  },

  loadLocations: async (): Promise<string[]> => {
    const api = getAppApi()?.ticket;
    if (!api) {
      return [];
    }

    try {
      return await api.loadLocations();
    } catch {
      return [];
    }
  },

  loadLocationsForAdmin: async (): Promise<Location[]> => {
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error("Location API is unavailable.");
    }

    return api.loadLocationsForAdmin();
  },

  addLocation: async (input: SaveLocationInput): Promise<Location> => {
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error("Location API is unavailable.");
    }

    return api.addLocation({
      location: input.location.trim().toUpperCase(),
      description: input.description.trim(),
    });
  },

  deactivateLocation: async (location: string): Promise<Location> => {
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error("Location API is unavailable.");
    }

    return api.deactivateLocation(location.trim().toUpperCase());
  },

  searchPaymentTicketByNumber: async (
    ticketNumber: number,
  ): Promise<TicketSearchResult | null> => {
    const normalizedTicketNumber = Number(ticketNumber);
    const api = getAppApi()?.ticket;

    if (
      !api ||
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      return null;
    }

    try {
      return await api.searchPaymentTicketByNumber(normalizedTicketNumber);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  searchTicketByNumber: async (
    ticketNumber: number,
  ): Promise<TicketSearchResult | null> => {
    const normalizedTicketNumber = Number(ticketNumber);
    const api = getAppApi()?.ticket;

    if (
      !api ||
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      return null;
    }

    try {
      return await api.searchTicketByNumber(normalizedTicketNumber);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  createPawnTicket: async (input: CreatePawnTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreatePawnTicketInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] createPawnTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.createPawnTicket(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  createSellTicket: async (input: CreateSellTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeCreateSellTicketInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] createSellTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.createSellTicket(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  updateTicket: async (input: UpdateTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeUpdateTicketInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] updateTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.updateTicket(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  convertTicket: async (input: ConvertTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeConvertTicketInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] convertTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.convertTicket(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  expireTicket: async (input: ExpireTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeExpireTicketInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] expireTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.expireTicket(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  markTicketStolen: async (input: MarkTicketStolenInput): Promise<Ticket> => {
    const normalizedInput = normalizeMarkTicketStolenInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] markTicketStolen(): Cannot get api from Electron",
      );
    }

    try {
      return await api.markTicketStolen(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  pickupTickets: async (input: PickupTicketsInput): Promise<Ticket[]> => {
    const normalizedInput = normalizePickupTicketsInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] pickupTickets(): Cannot get api from Electron",
      );
    }

    if (!normalizedInput.tickets.length) {
      return [];
    }

    try {
      return await api.pickupTickets(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  extendTickets: async (input: ExtendTicketsInput): Promise<Ticket[]> => {
    const normalizedInput = normalizeExtendTicketsInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] extendTickets(): Cannot get api from Electron",
      );
    }

    if (!normalizedInput.extensions.length) {
      return [];
    }

    try {
      return await api.extendTickets(normalizedInput);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  loadBuybackReport: async (
    input: ReportDateInput,
  ): Promise<BuybackReportResult> => {
    const normalizedInput = normalizeReportDateInput(input);
    const api = getAppApi()?.ticket;

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
    const api = getAppApi()?.ticket;

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
    const api = getAppApi()?.ticket;

    if (
      !api ||
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      return null;
    }

    try {
      return await api.loadTransferTicketPreview(normalizedTicketNumber);
    } catch (error) {
      throw mapBackendError(error);
    }
  },

  transferTicket: async (input: TransferTicketInput): Promise<Ticket> => {
    const normalizedInput = normalizeTransferTicketInput(input);
    const api = getAppApi()?.ticket;

    if (!api) {
      throw new Error(
        "[ticketService] transferTicket(): Cannot get api from Electron",
      );
    }

    try {
      return await api.transferTicket(normalizedInput);
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
export type { TicketFormError, TicketFormField } from "./ticketApiUtils";
