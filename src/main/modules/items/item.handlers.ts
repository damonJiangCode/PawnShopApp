import type { IpcMainInvokeEvent } from "electron";
import type {
  ItemSearchInput,
  ItemFormField,
  SaveItemInput,
} from "../../../shared/payload-contracts/item.contract.ts";
import { itemService } from "./item.service.ts";
import { CHANNELS } from "../../ipc/channels.ts";
import type { ItemOperationResult } from "../../../shared/api-contracts/itemApi.contract.ts";
import { extractFieldError } from "../../shared/createFieldError.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

const runItemOperation = async <T>(
  operation: () => Promise<T>,
): Promise<ItemOperationResult<T>> => {
  try {
    return { ok: true, result: await operation() };
  } catch (error) {
    const fieldError = extractFieldError(error);

    if (fieldError) {
      return {
        ok: false,
        field: fieldError.field as ItemFormField,
        message: fieldError.message,
      };
    }

    throw error;
  }
};

export const registerItemHandlers = () => {
  ipcMain.handle(
    CHANNELS.GET_ITEMS,
    async (_event: IpcMainInvokeEvent, ticketNumber: number) => {
      return itemService.loadItems(ticketNumber);
    },
  );

  ipcMain.handle(
    CHANNELS.GET_CLIENT_ITEMS,
    async (_event: IpcMainInvokeEvent, clientNumber: number) => {
      return itemService.loadItemsByClient(clientNumber);
    },
  );

  ipcMain.handle(CHANNELS.GET_ITEM_CATEGORIES, async () => {
    return itemService.loadItemCategories();
  });

  ipcMain.handle(
    CHANNELS.SEARCH_ITEMS,
    async (_event: IpcMainInvokeEvent, payload: ItemSearchInput) => {
      return runItemOperation(() => itemService.searchItems(payload));
    },
  );

  ipcMain.handle(
    CHANNELS.ADD_ITEM,
    async (_event: IpcMainInvokeEvent, payload: SaveItemInput) => {
      return runItemOperation(() => itemService.createItem(payload));
    },
  );

  ipcMain.handle(
    CHANNELS.UPDATE_ITEM,
    async (_event: IpcMainInvokeEvent, payload: SaveItemInput) => {
      return runItemOperation(() => itemService.updateItem(payload));
    },
  );

  ipcMain.handle(
    CHANNELS.DELETE_ITEM,
    async (
      _event: IpcMainInvokeEvent,
      ticketNumber: number,
      itemNumber: number,
    ) => {
      return runItemOperation(async () => {
        await itemService.deleteItem(ticketNumber, itemNumber);
        return null;
      });
    },
  );

  ipcMain.handle(
    CHANNELS.LINK_ITEMS_TO_TICKET,
    async (
      _event: IpcMainInvokeEvent,
      ticketNumber: number,
      itemNumbers: number[],
    ) => {
      return runItemOperation(() =>
        itemService.linkItemsToTicket(ticketNumber, itemNumbers),
      );
    },
  );

  ipcMain.handle(
    CHANNELS.SAVE_ITEM_IMAGE,
    async (_event: IpcMainInvokeEvent, fileName: string, base64: string) => {
      return itemService.saveItemImage(fileName, base64);
    },
  );
};
