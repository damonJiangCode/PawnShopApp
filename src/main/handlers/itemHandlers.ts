import type { IpcMainInvokeEvent } from "electron";
import type { SaveItemInput } from "../../shared/ipc/itemApi.ts";
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

  ipcMain.handle(CHANNELS.GET_ITEM_CATEGORIES, async () => {
    return itemService.loadCategories();
  });

  ipcMain.handle(CHANNELS.ADD_ITEM, async (
    _event: IpcMainInvokeEvent,
    payload: SaveItemInput,
  ) => {
    return itemService.createItem(payload);
  });

  ipcMain.handle(CHANNELS.UPDATE_ITEM, async (
    _event: IpcMainInvokeEvent,
    payload: SaveItemInput,
  ) => {
    return itemService.updateItem(payload);
  });

  ipcMain.handle(CHANNELS.DELETE_ITEM, async (
    _event: IpcMainInvokeEvent,
    ticketNumber: number,
    itemNumber: number,
  ) => {
    return itemService.deleteItem(ticketNumber, itemNumber);
  });

  ipcMain.handle(CHANNELS.SAVE_ITEM_IMAGE, async (
    _event: IpcMainInvokeEvent,
    fileName: string,
    base64: string,
  ) => {
    return itemService.saveItemImage(fileName, base64);
  });

  ipcMain.handle(CHANNELS.GET_ITEM_IMAGE, async (
    _event: IpcMainInvokeEvent,
    imagePath: string,
  ) => {
    return itemService.loadItemImage(imagePath);
  });
};
