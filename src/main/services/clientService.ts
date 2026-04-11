import type { Client, ID } from "../../shared/types/Client.ts";
import type {
  ClientNotesAction,
  SaveClientInput,
} from "../../shared/ipc/clientPayloadTypes.ts";
import { clientRepo } from "../repos/clientRepo.ts";
import { employeeService } from "./employeeService.ts";
import { createFieldError } from "../utils/createFieldError.ts";
import { imageStorage } from "../utils/imageStorage.ts";
import { runInTransaction } from "../utils/runInTransaction.ts";
import type { DbClient } from "../../db/connection.ts";

const normalizeClient = (client: Client): Client => ({
  ...client,
  first_name: client.first_name?.trim() ?? "",
  last_name: client.last_name?.trim() ?? "",
  middle_name: client.middle_name?.trim() ?? "",
  gender: client.gender?.trim() ?? "",
  hair_color: client.hair_color?.trim() ?? "",
  eye_color: client.eye_color?.trim() ?? "",
  address: client.address?.trim() ?? "",
  postal_code: client.postal_code?.trim() ?? "",
  city: client.city?.trim() ?? "",
  province: client.province?.trim() ?? "",
  country: client.country?.trim() ?? "",
  email: client.email?.trim() ?? "",
  phone: client.phone?.trim() ?? "",
  notes: client.notes?.trim() ?? "",
  image_path: client.image_path?.trim() ?? "",
});

const normalizeIdentifications = (ids: ID[]): ID[] =>
  (ids ?? [])
    .map((id) => ({
      ...id,
      id_type: id.id_type?.trim() ?? "",
      id_value: id.id_value?.trim() ?? "",
    }))
    .filter((id) => id.id_type && id.id_value);

const validateClient = (client: Client, identifications: ID[]) => {
  const requiredMissing =
    !client.first_name ||
    !client.last_name ||
    !client.date_of_birth ||
    !client.gender ||
    !client.hair_color ||
    !client.eye_color ||
    !client.height_cm ||
    !client.weight_kg ||
    !client.address ||
    !client.city ||
    !client.province ||
    !client.country;

  if (requiredMissing) {
    throw new Error("Please fill all required client fields before saving.");
  }

  if (identifications.length < 2) {
    throw new Error("Please provide at least two valid ID entries.");
  }
};

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
    throw createFieldError("employee_password", "Employee password is required.");
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

const normalizeSaveClientInput = (input: SaveClientInput) => ({
  client: normalizeClient(input.client),
  identifications: normalizeIdentifications(input.identifications ?? []),
  employee_password: input.employee_password?.trim() ?? "",
  notes_action: input.notes_action ?? "keep",
});

export const clientService = {
  searchClients: async (
    firstName: string,
    lastName: string,
  ): Promise<Client[]> => {
    const safeFirst = firstName?.trim() ?? "";
    const safeLast = lastName?.trim() ?? "";

    if (!safeFirst && !safeLast) {
      return [];
    }

    return clientRepo.searchByName(safeFirst, safeLast);
  },

  loadCities: async () => {
    return clientRepo.loadCities();
  },

  loadHairColors: async () => {
    return clientRepo.loadHairColors();
  },

  loadEyeColors: async () => {
    return clientRepo.loadEyeColors();
  },

  loadIdTypes: async () => {
    return clientRepo.loadIdTypes();
  },

  saveClientImage: async (fileName: string, base64: string): Promise<string> => {
    return imageStorage.saveClientImage(fileName, base64);
  },

  loadClientImage: async (imagePath: string): Promise<string> => {
    return imageStorage.loadClientImage(imagePath);
  },

  createClient: async (input: SaveClientInput): Promise<Client> => {
    const normalizedInput = normalizeSaveClientInput(input);
    validateClient(normalizedInput.client, normalizedInput.identifications);

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
      const insertedIds = await clientRepo.insertIds(
        insertedClient.client_number,
        normalizedInput.identifications,
        client,
      );

      return {
        ...preparedClient,
        client_number: insertedClient.client_number,
        updated_at: insertedClient.updated_at,
        identifications: insertedIds,
      };
    });
  },

  updateClient: async (input: SaveClientInput): Promise<Client> => {
    const normalizedInput = normalizeSaveClientInput(input);
    validateClient(normalizedInput.client, normalizedInput.identifications);

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

      const updatedClient = await clientRepo.update(preparedClient, client);
      await clientRepo.deleteIds(preparedClient.client_number as number, client);
      const insertedIds = await clientRepo.insertIds(
        preparedClient.client_number as number,
        normalizedInput.identifications,
        client,
      );

      return {
        ...preparedClient,
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
