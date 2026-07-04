import type { IpcMainInvokeEvent } from "electron";
import type {
  ItemLoadWindowData,
  OpenPaymentWindowInput,
} from "../../shared/types/windowApiTypes.ts";
import type { Item } from "../../shared/types/Item.ts";
import { CHANNELS } from "./channels.ts";
import { openWindowHost } from "../window/openWindowHost.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

type ItemLoadWindowSession = {
  payload: ItemLoadWindowData;
  window: Electron.BrowserWindow;
  resolve: (items: Item[] | null) => void;
  resolved: boolean;
};

const itemLoadWindows = new Map<string, ItemLoadWindowSession>();

const getItemRowId = (item: Item): number | string | undefined =>
  item.draft_id ?? item.item_number;

const finishItemLoadWindow = (
  requestId: string,
  selectedItemIds: Array<number | string> | null,
) => {
  const session = itemLoadWindows.get(requestId);

  if (!session || session.resolved) {
    return;
  }

  session.resolved = true;
  itemLoadWindows.delete(requestId);

  if (!selectedItemIds) {
    session.resolve(null);
  } else {
    const selectedIdSet = new Set(selectedItemIds.map(String));
    const selectedItems = session.payload.items.filter((item) => {
      const id = getItemRowId(item);
      return (
        id !== undefined &&
        selectedIdSet.has(String(id)) &&
        item.is_loadable !== false
      );
    });

    session.resolve(selectedItems);
  }

  if (!session.window.isDestroyed()) {
    session.window.close();
  }
};

export const registerWindowHandlers = () => {
  ipcMain.handle(
    CHANNELS.OPEN_PAYMENT_WINDOW,
    async (_event: IpcMainInvokeEvent, payload: OpenPaymentWindowInput) => {
      openWindowHost({
        screen: "payment",
        title: "Payment",
        width: 1180,
        height: 680,
        minWidth: 980,
        minHeight: 560,
        params: {
          clientNumber: payload.clientNumber,
          clientLastName: payload.clientLastName,
          clientFirstName: payload.clientFirstName,
        },
      });
    },
  );

  ipcMain.handle(
    CHANNELS.OPEN_TICKET_SEARCH_WINDOW,
    async (_event: IpcMainInvokeEvent) => {
      openWindowHost({
        screen: "ticket-search",
        title: "Search Ticket",
        description: "Search tickets by ticket number.",
        width: 720,
        height: 420,
      });
    },
  );

  ipcMain.handle(
    CHANNELS.OPEN_ITEM_SEARCH_WINDOW,
    async (_event: IpcMainInvokeEvent) => {
      openWindowHost({
        screen: "item-search",
        title: "Search Item",
        description:
          "Search by item number, brand name, model number, or serial number.",
        width: 1100,
        height: 640,
      });
    },
  );

  ipcMain.handle(
    CHANNELS.OPEN_ITEM_LOAD_WINDOW,
    async (_event: IpcMainInvokeEvent, payload: ItemLoadWindowData) => {
      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const childWindow = openWindowHost({
        screen: "item-load",
        title: payload.title,
        width: 980,
        height: 560,
        minWidth: 800,
        minHeight: 440,
        params: {
          requestId,
        },
      });

      const resultPromise = new Promise<Item[] | null>((resolve) => {
        itemLoadWindows.set(requestId, {
          payload,
          window: childWindow,
          resolve,
          resolved: false,
        });
      });

      childWindow.on("closed", () => {
        finishItemLoadWindow(requestId, null);
      });

      return resultPromise;
    },
  );

  ipcMain.handle(
    CHANNELS.GET_ITEM_LOAD_WINDOW_PAYLOAD,
    async (_event: IpcMainInvokeEvent, requestId: string) => {
      return itemLoadWindows.get(requestId)?.payload ?? null;
    },
  );

  ipcMain.handle(
    CHANNELS.SUBMIT_ITEM_LOAD_WINDOW,
    async (
      _event: IpcMainInvokeEvent,
      requestId: string,
      selectedItemIds: Array<number | string>,
    ) => {
      finishItemLoadWindow(requestId, selectedItemIds);
    },
  );

  ipcMain.handle(
    CHANNELS.CANCEL_ITEM_LOAD_WINDOW,
    async (_event: IpcMainInvokeEvent, requestId: string) => {
      finishItemLoadWindow(requestId, null);
    },
  );
};
