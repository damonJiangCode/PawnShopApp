import { ipcMain } from "electron";
import {
  createClient,
  searchClients,
  updateClient,
} from "../services/clientService.ts";
import {
  fetchCities,
  fetchEyeColors,
  fetchHairColors,
  fetchIdTypes,
} from "../services/lookupService.ts";
import { getClientImage, saveClientImage } from "../services/clientImageService.ts";

const CHANNELS = {
  SEARCH_CLIENTS: "search-clients",
  GET_CITIES: "get-cities",
  GET_HAIR_COLORS: "get-hair-colors",
  GET_EYE_COLORS: "get-eye-colors",
  GET_ID_TYPES: "get-id-types",
  ADD_CLIENT: "add-client",
  UPDATE_CLIENT: "update-client",
  SAVE_CLIENT_IMAGE: "save-client-image",
  GET_CLIENT_IMAGE: "get-client-image",
} as const;

export const registerIpcHandlers = () => {
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS,
    async (_event, firstName: string, lastName: string) => {
      return searchClients(firstName, lastName);
    }
  );

  ipcMain.handle(CHANNELS.GET_CITIES, async () => fetchCities());
  ipcMain.handle(CHANNELS.GET_HAIR_COLORS, async () => fetchHairColors());
  ipcMain.handle(CHANNELS.GET_EYE_COLORS, async () => fetchEyeColors());
  ipcMain.handle(CHANNELS.GET_ID_TYPES, async () => fetchIdTypes());
  ipcMain.handle(CHANNELS.ADD_CLIENT, async (_event, payload) => {
    const { client, identifications } = payload ?? {};
    return createClient(client, identifications ?? []);
  });
  ipcMain.handle(CHANNELS.UPDATE_CLIENT, async (_event, payload) => {
    const { client, identifications } = payload ?? {};
    return updateClient(client, identifications ?? []);
  });
  ipcMain.handle(
    CHANNELS.SAVE_CLIENT_IMAGE,
    async (_event, fileName: string, base64: string) => {
      return saveClientImage(fileName, base64);
    }
  );
  ipcMain.handle(
    CHANNELS.GET_CLIENT_IMAGE,
    async (_event, imagePath: string) => {
      return getClientImage(imagePath);
    }
  );
};
