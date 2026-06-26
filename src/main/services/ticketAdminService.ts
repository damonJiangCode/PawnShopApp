import type {
  HolidayDate,
  SaveHolidayInput,
} from "../../shared/types/holidayDate.ts";
import type {
  Location,
  SaveLocationInput,
} from "../../shared/types/location.ts";
import { holidayDateRepo } from "../repos/holidayDateRepo.ts";
import { ticketLocationRepo } from "../repos/ticketLocationRepo.ts";
import { ticketInput } from "./inputs/ticketInput.ts";

export const ticketAdminService = {
  loadHolidayDates: async (): Promise<HolidayDate[]> => {
    return holidayDateRepo.loadHolidayDates();
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

    const holiday = await holidayDateRepo.addHolidayDate(normalizedInput);

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

    const holiday = await holidayDateRepo.deleteHolidayDate(normalizedDate);

    if (!holiday) {
      throw new Error("That holiday date was not found.");
    }

    return holiday;
  },

  loadLocations: async (): Promise<string[]> => {
    return ticketLocationRepo.loadLocations();
  },

  loadAdminLocations: async (): Promise<Location[]> => {
    return ticketLocationRepo.loadAdminLocations();
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

    const location = await ticketLocationRepo.addLocation(normalizedInput);

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

    const location =
      await ticketLocationRepo.deactivateLocation(normalizedCode);

    if (!location) {
      throw new Error("That active location was not found.");
    }

    return location;
  },
};
