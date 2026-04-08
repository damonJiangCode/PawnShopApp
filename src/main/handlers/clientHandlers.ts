import type { IpcMainInvokeEvent } from "electron";
import type { SaveClientInput } from "../../shared/ipc/clientApi.ts";
import { clientService } from "../services/clientService.ts";
import { CHANNELS } from "./channels.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerClientHandlers = () => {
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS,
    async (
      _event: IpcMainInvokeEvent,
      firstName: string,
      lastName: string,
    ) => {
      return clientService.searchClients(firstName, lastName);
    },
  );

  ipcMain.handle(CHANNELS.GET_CITIES, async () => clientService.loadCities());
  ipcMain.handle(CHANNELS.GET_HAIR_COLORS, async () =>
    clientService.loadHairColors(),
  );
  ipcMain.handle(CHANNELS.GET_EYE_COLORS, async () =>
    clientService.loadEyeColors(),
  );
  ipcMain.handle(CHANNELS.GET_ID_TYPES, async () =>
    clientService.loadIdTypes(),
  );
  ipcMain.handle(CHANNELS.ADD_CLIENT, async (
    _event: IpcMainInvokeEvent,
    payload: SaveClientInput,
  ) => {
    return clientService.createClient(payload);
  });
  ipcMain.handle(CHANNELS.UPDATE_CLIENT, async (
    _event: IpcMainInvokeEvent,
    payload: SaveClientInput,
  ) => {
    return clientService.updateClient(payload);
  });
  ipcMain.handle(
    CHANNELS.DELETE_CLIENT,
    async (_event: IpcMainInvokeEvent, clientNumber: number) => {
      return clientService.deleteClient(clientNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.SAVE_CLIENT_IMAGE,
    async (
      _event: IpcMainInvokeEvent,
      fileName: string,
      base64: string,
    ) => {
      return clientService.saveClientImage(fileName, base64);
    },
  );
  ipcMain.handle(
    CHANNELS.GET_CLIENT_IMAGE,
    async (_event: IpcMainInvokeEvent, imagePath: string) => {
      return clientService.loadClientImage(imagePath);
    },
  );
};
