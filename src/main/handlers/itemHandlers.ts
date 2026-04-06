import { ipcMain } from "electron";
import { itemService } from "../services/itemService.ts";
import { CHANNELS } from "./channels.ts";

export const registerItemHandlers = () => {
  ipcMain.handle(CHANNELS.GET_ITEMS, async (_event, ticketNumber: number) => {
    return itemService.loadItems(ticketNumber);
  });
};
