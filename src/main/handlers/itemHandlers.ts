import type { IpcMainInvokeEvent } from "electron";
import { itemService } from "../services/itemService.ts";
import { CHANNELS } from "./channels.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerItemHandlers = () => {
  ipcMain.handle(CHANNELS.GET_ITEMS, async (
    _event: IpcMainInvokeEvent,
    ticketNumber: number,
  ) => {
    return itemService.loadItems(ticketNumber);
  });
};
