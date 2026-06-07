import type { IpcMainInvokeEvent } from "electron";
import type { SaveClientInput } from "../../shared/types/clientPayload.ts";
import { clientService } from "../services/clientService.ts";
import { CHANNELS } from "./channels.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerClientHandlers = () => {
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS,
    async (_event: IpcMainInvokeEvent, firstName: string, lastName: string) => {
      return clientService.searchClients(firstName, lastName);
    },
  );

  ipcMain.handle(CHANNELS.GET_CITIES, async () => clientService.loadCities());
  ipcMain.handle(CHANNELS.GET_HAIR_COLORS, async () =>
    clientService.loadHairColors(),
  );
  ipcMain.handle(CHANNELS.GET_ADMIN_HAIR_COLORS, async () =>
    clientService.loadAdminHairColors(),
  );
  ipcMain.handle(CHANNELS.GET_EYE_COLORS, async () =>
    clientService.loadEyeColors(),
  );
  ipcMain.handle(CHANNELS.GET_ADMIN_EYE_COLORS, async () =>
    clientService.loadAdminEyeColors(),
  );
  ipcMain.handle(
    CHANNELS.ADD_HAIR_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientService.addHairColor(color),
  );
  ipcMain.handle(
    CHANNELS.ACTIVATE_HAIR_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientService.activateHairColor(color),
  );
  ipcMain.handle(
    CHANNELS.DEACTIVATE_HAIR_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientService.deactivateHairColor(color),
  );
  ipcMain.handle(
    CHANNELS.ADD_EYE_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientService.addEyeColor(color),
  );
  ipcMain.handle(
    CHANNELS.ACTIVATE_EYE_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientService.activateEyeColor(color),
  );
  ipcMain.handle(
    CHANNELS.DEACTIVATE_EYE_COLOR,
    async (_event: IpcMainInvokeEvent, color: string) =>
      clientService.deactivateEyeColor(color),
  );
  ipcMain.handle(CHANNELS.GET_ID_TYPES, async () =>
    clientService.loadIdTypes(),
  );
  ipcMain.handle(
    CHANNELS.ADD_CLIENT,
    async (_event: IpcMainInvokeEvent, payload: SaveClientInput) => {
      return clientService.createClient(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.UPDATE_CLIENT,
    async (_event: IpcMainInvokeEvent, payload: SaveClientInput) => {
      return clientService.updateClient(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.DELETE_CLIENT,
    async (_event: IpcMainInvokeEvent, clientNumber: number) => {
      return clientService.deleteClient(clientNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.SAVE_CLIENT_IMAGE,
    async (_event: IpcMainInvokeEvent, fileName: string, base64: string) => {
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
