import type { ClientLookup } from "../../../shared/utils/clientLookup.ts";
import type { IpcMainInvokeEvent } from "electron";
import type {
  ClientFormField,
  SaveClientInput,
} from "../../../shared/payload-contracts/client.contract.ts";
import type { ClientMutationResult } from "../../../shared/api-contracts/clientApi.contract.ts";
import { clientReferenceService } from "./client-reference.service.ts";
import { clientService } from "./client.service.ts";
import { CHANNELS } from "../../ipc/channels.ts";
import { extractFieldError } from "../../shared/createFieldError.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

const runClientMutation = async (
  operation: () => Promise<
    import("../../../shared/models/client.model.ts").Client
  >,
): Promise<ClientMutationResult> => {
  try {
    return { ok: true, client: await operation() };
  } catch (error) {
    const fieldError = extractFieldError(error);

    if (fieldError) {
      return {
        ok: false,
        field: fieldError.field as ClientFormField,
        message: fieldError.message,
      };
    }

    throw error;
  }
};

export const registerClientHandlers = () => {
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS_BY_LOOKUP,
    async (_event: IpcMainInvokeEvent, lookup: ClientLookup) =>
      clientService.searchClientsByLookup(lookup),
  );
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS,
    async (_event: IpcMainInvokeEvent, firstName: string, lastName: string) => {
      return clientService.searchClients(firstName, lastName);
    },
  );
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS_BY_DOB,
    async (_event: IpcMainInvokeEvent, dateOfBirth: string) => {
      return clientService.searchClientsByDob(dateOfBirth);
    },
  );

  ipcMain.handle(CHANNELS.GET_CITIES, async () =>
    clientReferenceService.loadCities(),
  );
  ipcMain.handle(CHANNELS.GET_HAIR_COLORS, async () =>
    clientReferenceService.loadHairColors(),
  );
  ipcMain.handle(CHANNELS.GET_ADMIN_HAIR_COLORS, async () =>
    clientReferenceService.loadHairColorsForAdmin(),
  );
  ipcMain.handle(CHANNELS.GET_EYE_COLORS, async () =>
    clientReferenceService.loadEyeColors(),
  );
  ipcMain.handle(CHANNELS.GET_ADMIN_EYE_COLORS, async () =>
    clientReferenceService.loadEyeColorsForAdmin(),
  );
  ipcMain.handle(
    CHANNELS.ADD_HAIR_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientReferenceService.addHairColor(color),
  );
  ipcMain.handle(
    CHANNELS.ACTIVATE_HAIR_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientReferenceService.activateHairColor(color),
  );
  ipcMain.handle(
    CHANNELS.DEACTIVATE_HAIR_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientReferenceService.deactivateHairColor(color),
  );
  ipcMain.handle(
    CHANNELS.ADD_EYE_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientReferenceService.addEyeColor(color),
  );
  ipcMain.handle(
    CHANNELS.ACTIVATE_EYE_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientReferenceService.activateEyeColor(color),
  );
  ipcMain.handle(
    CHANNELS.DEACTIVATE_EYE_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientReferenceService.deactivateEyeColor(color),
  );
  ipcMain.handle(CHANNELS.GET_ID_TYPES, async () =>
    clientReferenceService.loadIdTypes(),
  );
  ipcMain.handle(
    CHANNELS.ADD_CLIENT,
    async (_event: IpcMainInvokeEvent, payload: SaveClientInput) => {
      return runClientMutation(() => clientService.createClient(payload));
    },
  );
  ipcMain.handle(
    CHANNELS.UPDATE_CLIENT,
    async (_event: IpcMainInvokeEvent, payload: SaveClientInput) => {
      return runClientMutation(() => clientService.updateClient(payload));
    },
  );
  ipcMain.handle(
    CHANNELS.SAVE_CLIENT_IMAGE,
    async (_event: IpcMainInvokeEvent, fileName: string, base64: string) => {
      return clientService.saveClientImage(fileName, base64);
    },
  );
};
