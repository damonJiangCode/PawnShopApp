import path from "path";
import type { IpcMainInvokeEvent } from "electron";
import type { ItemLoadWindowPayload } from "../../shared/types/windowPayload.ts";
import type { Item } from "../../shared/types/Item.ts";
import { CHANNELS } from "./channels.ts";

const { BrowserWindow, ipcMain } = require("electron/main") as typeof import("electron");

type ItemLoadWindowSession = {
  payload: ItemLoadWindowPayload;
  window: Electron.BrowserWindow;
  resolve: (items: Item[] | null) => void;
  resolved: boolean;
};

const preloadPath = path.resolve(process.cwd(), "src/preload/index.cjs");
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
    CHANNELS.OPEN_ITEM_LOAD_WINDOW,
    async (_event: IpcMainInvokeEvent, payload: ItemLoadWindowPayload) => {
      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const childWindow = new BrowserWindow({
        width: 980,
        height: 560,
        minWidth: 800,
        minHeight: 440,
        center: true,
        show: false,
        title: payload.title,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: preloadPath,
        },
      });

      childWindow.setMenu(null);

      const resultPromise = new Promise<Item[] | null>((resolve) => {
        itemLoadWindows.set(requestId, {
          payload,
          window: childWindow,
          resolve,
          resolved: false,
        });
      });

      childWindow.once("ready-to-show", () => {
        childWindow.show();
        childWindow.focus();
      });

      childWindow.on("closed", () => {
        finishItemLoadWindow(requestId, null);
      });

      childWindow.webContents.on(
        "did-fail-load",
        (_failedEvent, errorCode, errorDescription, validatedURL) => {
          console.error("[main] failed to load item load window", {
            errorCode,
            errorDescription,
            validatedURL,
          });
        },
      );

      const searchParams = new URLSearchParams({
        window: "item-load",
        requestId,
      });

      await childWindow.loadURL(`http://localhost:5173?${searchParams.toString()}`);

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
