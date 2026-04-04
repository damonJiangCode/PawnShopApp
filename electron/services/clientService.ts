import { app } from "electron";
import fs from "fs/promises";
import path from "path";
import type { Client, ID } from "../../shared/types/Client.ts";
import {
  deleteClientByNumber,
  deleteClientIds,
  insertClient,
  insertClientIds,
  searchClientsByName,
  updateClientRecord,
} from "../db/repo/clientRepo.ts";
import { findEmployeeByPassword } from "../db/repo/employeeRepo.ts";
import { connect } from "../db/table/createTable.ts";

const FIELD_ERROR_PREFIX = "[field-error]";
const getBaseDir = () => path.join(app.getPath("userData"), "client-images");

type DbClient = Awaited<ReturnType<typeof connect>>;

type ClientNotesAction = "keep" | "clear" | "append_signature";

type SaveClientInput = {
  client: Client;
  identifications: ID[];
  employee_password?: string;
  notes_action?: ClientNotesAction;
};

const createFieldError = (field: string, message: string) =>
  new Error(`${FIELD_ERROR_PREFIX}${field}:${message}`);

const resolveImagePath = (imagePath: string) => {
  const baseDir = getBaseDir();
  const resolved = path.resolve(baseDir, imagePath);

  if (!resolved.startsWith(baseDir)) {
    throw new Error("Invalid image path");
  }

  return resolved;
};

const rollbackQuietly = async (client: DbClient, scope: string) => {
  try {
    await client.query("ROLLBACK");
  } catch (rollbackError) {
    console.error(
      `[clientBackendService] rollback failed in ${scope}:`,
      rollbackError,
    );
  }
};

const runInTransaction = async <T>(
  scope: string,
  work: (client: DbClient) => Promise<T>,
): Promise<T> => {
  const client = await connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await rollbackQuietly(client, scope);
    throw error;
  } finally {
    client.release();
  }
};

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

  const employee = await findEmployeeByPassword(employeePassword, dbClient);

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

export const clientBackendService = {
  searchClients: async (
    firstName: string,
    lastName: string,
  ): Promise<Client[]> => {
    const safeFirst = firstName?.trim() ?? "";
    const safeLast = lastName?.trim() ?? "";

    if (!safeFirst && !safeLast) {
      return [];
    }

    return searchClientsByName(safeFirst, safeLast);
  },

  saveClientImage: async (fileName: string, base64: string): Promise<string> => {
    if (!base64) {
      throw new Error("Missing image data");
    }

    const baseDir = getBaseDir();
    await fs.mkdir(baseDir, { recursive: true });

    const safeName = path.basename(fileName);
    const relPath = path.join("client-images", safeName);
    const absPath = resolveImagePath(safeName);
    const buffer = Buffer.from(base64, "base64");

    await fs.writeFile(absPath, buffer);
    return relPath;
  },

  loadClientImage: async (imagePath: string): Promise<string> => {
    const baseDir = getBaseDir();
    const absPath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(app.getPath("userData"), imagePath);

    if (!absPath.startsWith(baseDir)) {
      throw new Error("Invalid image path");
    }

    const buffer = await fs.readFile(absPath);
    return buffer.toString("base64");
  },

  createClient: async (input: SaveClientInput): Promise<Client> => {
    const normalizedInput = normalizeSaveClientInput(input);
    validateClient(normalizedInput.client, normalizedInput.identifications);

    if (normalizedInput.client.notes && normalizedInput.notes_action !== "append_signature") {
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

      const insertedClient = await insertClient(preparedClient, client);
      const insertedIds = await insertClientIds(
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

      const updatedClient = await updateClientRecord(preparedClient, client);
      await deleteClientIds(preparedClient.client_number as number, client);
      const insertedIds = await insertClientIds(
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

    return deleteClientByNumber(clientNumber);
  },
};
