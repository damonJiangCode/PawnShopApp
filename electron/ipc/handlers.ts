import { app, ipcMain } from "electron";
import fs from "fs/promises";
import path from "path";
import {
  addClient,
  deleteClientByNumber,
  searchClientsByName,
  updateClient,
} from "../db/repo/clientRepo.ts";
import {
  getCities,
  getEyeColors,
  getHairColors,
  getIdTypes,
} from "../db/repo/lookupRepo.ts";
import { findEmployeeByPassword } from "../db/repo/employeeRepo.ts";
import { ticketRepo } from "../db/repo/ticketRepo.ts";
import { itemRepo } from "../db/repo/itemRepo.ts";

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
  GET_ITEMS: "get-items",
  ADD_TICKET: "add-ticket",
} as const;

const getBaseDir = () => path.join(app.getPath("userData"), "client-images");

const resolveImagePath = (imagePath: string) => {
  const baseDir = getBaseDir();
  const resolved = path.resolve(baseDir, imagePath);
  if (!resolved.startsWith(baseDir)) {
    throw new Error("Invalid image path");
  }
  return resolved;
};

const saveClientImage = async (fileName: string, base64: string) => {
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
};

const getClientImage = async (imagePath: string) => {
  const baseDir = getBaseDir();
  const absPath = path.isAbsolute(imagePath)
    ? imagePath
    : path.resolve(app.getPath("userData"), imagePath);

  if (!absPath.startsWith(baseDir)) {
    throw new Error("Invalid image path");
  }

  const buffer = await fs.readFile(absPath);
  return buffer.toString("base64");
};

export const registerIpcHandlers = () => {
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS,
    async (_event, firstName: string, lastName: string) => {
      const safeFirst = firstName?.trim() ?? "";
      const safeLast = lastName?.trim() ?? "";

      if (!safeFirst && !safeLast) {
        return [];
      }

      return searchClientsByName(safeFirst, safeLast);
    },
  );

  ipcMain.handle(CHANNELS.GET_CITIES, async () => getCities());
  ipcMain.handle(CHANNELS.GET_HAIR_COLORS, async () => getHairColors());
  ipcMain.handle(CHANNELS.GET_EYE_COLORS, async () => getEyeColors());
  ipcMain.handle(CHANNELS.GET_ID_TYPES, async () => getIdTypes());
  ipcMain.handle(CHANNELS.ADD_CLIENT, async (_event, payload) => {
    const { client, identifications } = payload ?? {};
    return addClient(client, identifications ?? []);
  });
  ipcMain.handle(CHANNELS.UPDATE_CLIENT, async (_event, payload) => {
    const { client, identifications } = payload ?? {};
    return updateClient(client, identifications ?? []);
  });
  ipcMain.handle(
    CHANNELS.DELETE_CLIENT,
    async (_event, clientNumber: number) => {
      return deleteClientByNumber(clientNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.VERIFY_EMPLOYEE_PASSWORD,
    async (_event, password: string) => {
      const safePassword = password?.trim() ?? "";
      if (!safePassword) {
        return null;
      }

      return findEmployeeByPassword(safePassword);
    },
  );
  ipcMain.handle(
    CHANNELS.GET_EMPLOYEE_NAME,
    async (_event, employeePassword: string) => {
      return ticketRepo.getEmployeeName(employeePassword);
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
    return ticketRepo.getTickets(clientNumber);
  });
  ipcMain.handle(CHANNELS.GET_ITEMS, async (_event, ticketNumber: number) => {
    return itemRepo.getItems(ticketNumber);
  });
  ipcMain.handle(CHANNELS.ADD_TICKET, async (_event, payload) => {
    return ticketRepo.addTicket(payload);
  });
};
