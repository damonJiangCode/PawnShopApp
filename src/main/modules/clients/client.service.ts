import {
  normalizeClientLookup,
  type ClientLookup,
} from "../../../shared/utils/clientLookup.ts";
import type { Client } from "../../../shared/models/client.model.ts";
import type {
  ClientNotesAction,
  SaveClientInput,
} from "../../../shared/payload-contracts/client.contract.ts";
import { clientIdRepo } from "./client-id.repo.ts";
import { clientRepo } from "./client.repo.ts";
import { employeeService } from "../employees/employee.service.ts";
import { clientInput } from "./client.input.ts";
import { createFieldError } from "../../shared/createFieldError.ts";
import { imageStorage } from "../../shared/imageStorage.ts";
import { runInTransaction } from "../../shared/runInTransaction.ts";
import {
  getDatabaseDateKey,
  type DbClient,
} from "../../database/connection.ts";

const resolveNotes = async (
  proposedNotes: string,
  existingNotes: string,
  notesAction: ClientNotesAction,
  employeePassword: string,
  dbClient: DbClient,
): Promise<string> => {
  if (notesAction === "clear") {
    return "";
  }

  if (notesAction !== "append_signature") {
    return existingNotes;
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

  if (!proposedNotes) {
    return "";
  }

  const formattedDate = await getDatabaseDateKey(dbClient);
  return `${proposedNotes} (${employee.first_name}, ${formattedDate})`;
};

const finalizeSavedClientImage = async (savedClient: Client) => {
  const stagedImagePath = savedClient.image_path ?? "";
  let finalizedImagePath = "";

  if (!stagedImagePath || !savedClient.client_number) {
    return savedClient;
  }

  try {
    finalizedImagePath = await imageStorage.finalizeClientImage(
      savedClient.client_number,
      stagedImagePath,
    );

    if (!finalizedImagePath || finalizedImagePath === stagedImagePath) {
      return savedClient;
    }

    await runInTransaction("finalizeClientImage", async (client) =>
      clientRepo.updateImagePath(
        savedClient.client_number as number,
        finalizedImagePath,
        client,
      ),
    );

    try {
      await imageStorage.removeStagedImage(stagedImagePath);
    } catch (error) {
      console.error("[image] Unable to remove staged client image:", error);
    }

    return { ...savedClient, image_path: finalizedImagePath };
  } catch (error) {
    if (finalizedImagePath && finalizedImagePath !== stagedImagePath) {
      await imageStorage
        .removeFinalizedImage("client", finalizedImagePath)
        .catch((cleanupError) => {
          console.error(
            "[image] Unable to remove unused finalized client image:",
            cleanupError,
          );
        });
    }
    console.error(
      "[image] Unable to finalize client image; keeping staged image:",
      error,
    );
    return savedClient;
  }
};

export const clientService = {
  searchClientsByLookup: async (lookup: ClientLookup): Promise<Client[]> => {
    const normalized = normalizeClientLookup(lookup);
    if (!normalized.value) return [];
    return clientRepo.searchByLookup(normalized);
  },
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

  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    return imageStorage.saveClientImage(fileName, base64);
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
      throw createFieldError(
        "client",
        "Notes require employee authorization before saving.",
      );
    }

    const createdClient = await runInTransaction(
      "createClient",
      async (client) => {
        const idConflict = await clientIdRepo.assertNewIdsAvailable(
          normalizedInput.identifications,
          [],
          null,
          client,
        );

        if (idConflict) {
          throw createFieldError("identifications", idConflict);
        }

        const nextNotes = await resolveNotes(
          normalizedInput.client.notes,
          "",
          normalizedInput.notes_action,
          normalizedInput.employee_password,
          client,
        );

        const preparedClient = {
          ...normalizedInput.client,
          notes: nextNotes,
        };

        const insertedClient = await clientRepo.create(preparedClient, client);
        const insertedIds = await clientIdRepo.insertIds(
          insertedClient.client_number,
          normalizedInput.identifications,
          client,
        );

        return {
          ...preparedClient,
          image_path: preparedClient.image_path,
          client_number: insertedClient.client_number,
          updated_at: insertedClient.updated_at,
          identifications: insertedIds,
        };
      },
    );

    return finalizeSavedClientImage(createdClient);
  },

  updateClient: async (input: SaveClientInput): Promise<Client> => {
    const normalizedInput = clientInput.normalizeSaveClient(input);
    let previousImagePath = "";
    clientInput.validateClient(
      normalizedInput.client,
      normalizedInput.identifications,
    );

    if (!normalizedInput.client.client_number) {
      throw new Error("Missing client number for update.");
    }

    const updatedClient = await runInTransaction(
      "updateClient",
      async (client) => {
        const currentClient = await clientRepo.loadByNumberForUpdate(
          normalizedInput.client.client_number as number,
          client,
        );

        if (!currentClient) {
          throw createFieldError("client", "This client no longer exists.");
        }

        previousImagePath = currentClient.image_path ?? "";

        const expectedUpdatedAt = new Date(
          normalizedInput.client.updated_at,
        ).getTime();
        const currentUpdatedAt = new Date(currentClient.updated_at).getTime();

        if (
          !Number.isFinite(expectedUpdatedAt) ||
          expectedUpdatedAt !== currentUpdatedAt
        ) {
          throw createFieldError(
            "client",
            "This client was changed on another computer. Refresh it before saving.",
          );
        }

        const idConflict = await clientIdRepo.assertNewIdsAvailable(
          normalizedInput.identifications,
          currentClient.identifications ?? [],
          currentClient.client_number as number,
          client,
        );

        if (idConflict) {
          throw createFieldError("identifications", idConflict);
        }

        const nextNotes = await resolveNotes(
          normalizedInput.client.notes,
          currentClient.notes,
          normalizedInput.notes_action,
          normalizedInput.employee_password,
          client,
        );

        const preparedClient = {
          ...normalizedInput.client,
          notes: nextNotes,
        };

        const updatedClient = await clientRepo.update(preparedClient, client);
        await clientIdRepo.deleteIds(
          preparedClient.client_number as number,
          client,
        );
        const insertedIds = await clientIdRepo.insertIds(
          preparedClient.client_number as number,
          normalizedInput.identifications,
          client,
        );

        return {
          ...preparedClient,
          updated_at: updatedClient.updated_at,
          identifications: insertedIds,
        };
      },
    );

    const finalizedClient = await finalizeSavedClientImage(updatedClient);

    if (previousImagePath && previousImagePath !== finalizedClient.image_path) {
      await imageStorage
        .removeFinalizedImage("client", previousImagePath)
        .catch((error) => {
          console.error("[image] Unable to remove old client image:", error);
        });
    }

    return finalizedClient;
  },
};
