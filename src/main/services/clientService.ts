import type { Client } from "../../shared/types/Client.ts";
import type {
  ClientNotesAction,
  SaveClientInput,
} from "../../shared/types/clientPayload.ts";
import { clientRepo } from "../repos/clientRepo.ts";
import { employeeService } from "./employeeService.ts";
import { clientInput } from "./inputs/clientInput.ts";
import { createFieldError } from "../utils/createFieldError.ts";
import { imageStorage } from "../utils/imageStorage.ts";
import { runInTransaction } from "../utils/runInTransaction.ts";
import type { DbClient } from "../../db/connection.ts";
import type { HairColor } from "../../shared/types/hairColor.ts";
import type { EyeColor } from "../../shared/types/eyeColor.ts";

const resolveNotes = async (
  client: Client,
  notesAction: ClientNotesAction,
  employeePassword: string,
  dbClient: DbClient,
): Promise<string> => {
  if (notesAction === "clear") {
    return "";
  }

  if (notesAction !== "append_signature") {
    return client.notes;
  }

  if (!employeePassword) {
    throw createFieldError(
      "employee_password",
      "Employee password is required.",
    );
  }

  const employee = await employeeService.findByPassword(
    employeePassword,
    dbClient,
  );

  if (!employee) {
    throw createFieldError(
      "employee_password",
      "Employee password is incorrect.",
    );
  }

  if (!client.notes) {
    return "";
  }

  const formattedDate = new Date().toLocaleDateString("en-CA");
  return `${client.notes} (${employee.first_name}, ${formattedDate})`;
};

export const clientService = {
  searchClients: async (
    firstName: string,
    lastName: string,
  ): Promise<Client[]> => {
    const { firstName: safeFirst, lastName: safeLast } =
      clientInput.normalizeNameSearch(firstName, lastName);

    if (!safeFirst && !safeLast) {
      return [];
    }

    return clientRepo.searchByName(safeFirst, safeLast);
  },

  searchClientsByDob: async (dateOfBirth: string): Promise<Client[]> => {
    const safeDob = clientInput.normalizeDobSearch(dateOfBirth);

    if (!safeDob) {
      return [];
    }

    return clientRepo.searchByDob(safeDob);
  },

  loadCities: async () => {
    return clientRepo.loadCities();
  },

  loadHairColors: async () => {
    return clientRepo.loadHairColors();
  },

  loadAdminHairColors: async (): Promise<HairColor[]> => {
    return clientRepo.loadAdminHairColors();
  },

  addHairColor: async (color: string): Promise<string> => {
    const normalizedColor = clientInput.normalizeColor(color).toUpperCase();

    if (!normalizedColor) {
      throw new Error("Hair color is required.");
    }

    const savedColor = await clientRepo.addHairColor(normalizedColor);

    if (!savedColor) {
      throw new Error("That hair color already exists.");
    }

    return savedColor;
  },

  deactivateHairColor: async (color: string): Promise<HairColor> => {
    const deactivatedColor = await clientRepo.deactivateHairColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!deactivatedColor) {
      throw new Error("That active hair color was not found.");
    }

    return deactivatedColor;
  },

  activateHairColor: async (color: string): Promise<HairColor> => {
    const activatedColor = await clientRepo.activateHairColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!activatedColor) {
      throw new Error("That inactive hair color was not found.");
    }

    return activatedColor;
  },

  loadEyeColors: async () => {
    return clientRepo.loadEyeColors();
  },

  loadAdminEyeColors: async (): Promise<EyeColor[]> => {
    return clientRepo.loadAdminEyeColors();
  },

  addEyeColor: async (color: string): Promise<string> => {
    const normalizedColor = clientInput.normalizeColor(color).toUpperCase();

    if (!normalizedColor) {
      throw new Error("Eye color is required.");
    }

    const savedColor = await clientRepo.addEyeColor(normalizedColor);

    if (!savedColor) {
      throw new Error("That eye color already exists.");
    }

    return savedColor;
  },

  deactivateEyeColor: async (color: string): Promise<EyeColor> => {
    const deactivatedColor = await clientRepo.deactivateEyeColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!deactivatedColor) {
      throw new Error("That active eye color was not found.");
    }

    return deactivatedColor;
  },

  activateEyeColor: async (color: string): Promise<EyeColor> => {
    const activatedColor = await clientRepo.activateEyeColor(
      clientInput.normalizeColor(color).toUpperCase(),
    );

    if (!activatedColor) {
      throw new Error("That inactive eye color was not found.");
    }

    return activatedColor;
  },

  loadIdTypes: async () => {
    return clientRepo.loadIdTypes();
  },

  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    return imageStorage.saveClientImage(fileName, base64);
  },

  loadClientImage: async (imagePath: string): Promise<string> => {
    return imageStorage.loadClientImage(imagePath);
  },

  createClient: async (input: SaveClientInput): Promise<Client> => {
    const normalizedInput = clientInput.normalizeSaveClient(input);
    clientInput.validateClient(
      normalizedInput.client,
      normalizedInput.identifications,
    );

    if (
      normalizedInput.client.notes &&
      normalizedInput.notes_action !== "append_signature"
    ) {
      throw new Error("Notes require employee authorization before saving.");
    }

    return runInTransaction("createClient", async (client) => {
      const nextNotes = await resolveNotes(
        normalizedInput.client,
        normalizedInput.notes_action,
        normalizedInput.employee_password,
        client,
      );

      const preparedClient = {
        ...normalizedInput.client,
        notes: nextNotes,
      };

      const insertedClient = await clientRepo.create(preparedClient, client);
      const imagePath = preparedClient.image_path
        ? await imageStorage.finalizeClientImage(
            insertedClient.client_number,
            preparedClient.image_path,
          )
        : "";

      if (imagePath && imagePath !== preparedClient.image_path) {
        await clientRepo.updateImagePath(
          insertedClient.client_number,
          imagePath,
          client,
        );
      }

      const insertedIds = await clientRepo.insertIds(
        insertedClient.client_number,
        normalizedInput.identifications,
        client,
      );

      return {
        ...preparedClient,
        image_path: imagePath || preparedClient.image_path,
        client_number: insertedClient.client_number,
        updated_at: insertedClient.updated_at,
        identifications: insertedIds,
      };
    });
  },

  updateClient: async (input: SaveClientInput): Promise<Client> => {
    const normalizedInput = clientInput.normalizeSaveClient(input);
    clientInput.validateClient(
      normalizedInput.client,
      normalizedInput.identifications,
    );

    if (!normalizedInput.client.client_number) {
      throw new Error("Missing client number for update.");
    }

    return runInTransaction("updateClient", async (client) => {
      const nextNotes = await resolveNotes(
        normalizedInput.client,
        normalizedInput.notes_action,
        normalizedInput.employee_password,
        client,
      );

      const preparedClient = {
        ...normalizedInput.client,
        notes: nextNotes,
      };

      const imagePath = preparedClient.image_path
        ? await imageStorage.finalizeClientImage(
            preparedClient.client_number as number,
            preparedClient.image_path,
          )
        : "";
      const preparedClientWithImage = {
        ...preparedClient,
        image_path: imagePath || preparedClient.image_path,
      };

      const updatedClient = await clientRepo.update(
        preparedClientWithImage,
        client,
      );
      await clientRepo.deleteIds(
        preparedClientWithImage.client_number as number,
        client,
      );
      const insertedIds = await clientRepo.insertIds(
        preparedClientWithImage.client_number as number,
        normalizedInput.identifications,
        client,
      );

      return {
        ...preparedClientWithImage,
        updated_at: updatedClient.updated_at,
        identifications: insertedIds,
      };
    });
  },

  deleteClient: async (clientNumber: number): Promise<boolean> => {
    if (!clientNumber) {
      return false;
    }

    return clientRepo.deleteByNumber(clientNumber);
  },
};
