import { ipcMain } from "electron";
import {
  createClient,
  deleteClient,
  searchClients,
  updateClient,
} from "../services/clientService.ts";
import {
  fetchCities,
  fetchEyeColors,
  fetchHairColors,
  fetchIdTypes,
} from "../services/lookupService.ts";
import {
  getClientImage,
  saveClientImage,
} from "../services/clientImageService.ts";
import { verifyEmployeePassword } from "../services/employeeService.ts";
import { ticketService } from "../services/ticketService.ts";

const CHANNELS = {
  SEARCH_CLIENTS: "search-clients",
  GET_CITIES: "get-cities",
  GET_HAIR_COLORS: "get-hair-colors",
  GET_EYE_COLORS: "get-eye-colors",
  GET_ID_TYPES: "get-id-types",
  ADD_CLIENT: "add-client",
  UPDATE_CLIENT: "update-client",
  DELETE_CLIENT: "delete-client",
  SAVE_CLIENT_IMAGE: "save-client-image",
  GET_CLIENT_IMAGE: "get-client-image",
  VERIFY_EMPLOYEE_PASSWORD: "verify-employee-password",
  GET_EMPLOYEE_NAME: "get-employee-name",
  GET_TICKETS: "get-tickets",
} as const;

export const registerIpcHandlers = () => {
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS,
    async (_event, firstName: string, lastName: string) => {
      return searchClients(firstName, lastName);
    },
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
    CHANNELS.DELETE_CLIENT,
    async (_event, clientNumber: number) => {
      return deleteClient(clientNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.VERIFY_EMPLOYEE_PASSWORD,
    async (_event, password: string) => {
      return verifyEmployeePassword(password);
    },
  );
  ipcMain.handle(
    CHANNELS.GET_EMPLOYEE_NAME,
    async (_event, employeePassword: string) => {
      return ticketService.fetchEmployeeName(employeePassword);
    },
  );
  ipcMain.handle(
    CHANNELS.SAVE_CLIENT_IMAGE,
    async (_event, fileName: string, base64: string) => {
      return saveClientImage(fileName, base64);
    },
  );
  ipcMain.handle(
    CHANNELS.GET_CLIENT_IMAGE,
    async (_event, imagePath: string) => {
      return getClientImage(imagePath);
    },
  );
  ipcMain.handle(CHANNELS.GET_TICKETS, async (_event, clientNumber: number) => {
    return ticketService.fetchTickets(clientNumber);
  });
};
