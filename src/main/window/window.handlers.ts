import type { IpcMainInvokeEvent } from "electron";
import type {
  ItemLoadWindowData,
  OpenPaymentWindowInput,
} from "../../shared/payload-contracts/window.contract.ts";
import type { Item } from "../../shared/models/item.model.ts";
import { CHANNELS } from "../ipc/channels.ts";
import { openWindowHost } from "./openWindowHost.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

type ItemLoadWindowSession = {
  payload: ItemLoadWindowData;
  window: Electron.BrowserWindow;
  resolve: (items: Item[] | null) => void;
  resolved: boolean;
};

const itemLoadWindows = new Map<string, ItemLoadWindowSession>();
let activeItemLoadRequestId: string | null = null;

const getItemRowId = (item: Item): number | string | undefined =>
  item.draft_id ?? item.item_number;

const mergeItemLoadPayload = (
  currentPayload: ItemLoadWindowData,
  nextPayload: ItemLoadWindowData,
): ItemLoadWindowData => {
  const existingIds = new Set(
    currentPayload.items
      .map(getItemRowId)
      .filter((id): id is number | string => id !== undefined)
      .map(String),
  );
  const nextItems = nextPayload.items.filter((item) => {
    const id = getItemRowId(item);
    return id === undefined || !existingIds.has(String(id));
  });

  return {
    title: nextPayload.mode === "repawn" ? "Repawn Items" : "Load Items",
    description:
      nextPayload.mode === "repawn"
        ? "Select items from loaded repawn tickets and add them to the new ticket."
        : "Select items from loaded history tickets and add them to the current ticket.",
    actionLabel: nextPayload.actionLabel,
    items: [...currentPayload.items, ...nextItems],
    mode: nextPayload.mode,
  };
};

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
  if (activeItemLoadRequestId === requestId) {
    activeItemLoadRequestId = null;
  }

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
        description: "Search by item number or item detail.",
        width: 1100,
        height: 640,
      });
    },
  );

  ipcMain.handle(
    CHANNELS.OPEN_ITEM_LOAD_WINDOW,
    async (_event: IpcMainInvokeEvent, payload: ItemLoadWindowData) => {
      const activeSession = activeItemLoadRequestId
        ? itemLoadWindows.get(activeItemLoadRequestId)
        : null;

      if (
        activeItemLoadRequestId &&
        activeSession &&
        !activeSession.window.isDestroyed()
      ) {
        activeSession.resolve(null);
        activeSession.payload = mergeItemLoadPayload(
          activeSession.payload,
          payload,
        );
        activeSession.resolved = false;
        const resultPromise = new Promise<Item[] | null>((resolve) => {
          activeSession.resolve = resolve;
        });

        activeSession.window.setTitle(activeSession.payload.title);
        activeSession.window.show();
        activeSession.window.focus();
        activeSession.window.webContents.send(
          CHANNELS.ITEM_LOAD_WINDOW_PAYLOAD_UPDATED,
          activeItemLoadRequestId,
        );

        return resultPromise;
      }

      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      activeItemLoadRequestId = requestId;

      const resultPromise = new Promise<Item[] | null>((resolve) => {
        const childWindow = openWindowHost({
          screen: "item-load",
          title: payload.title,
          width: 1180,
          height: 560,
          minWidth: 1040,
          minHeight: 440,
          params: {
            requestId,
          },
        });

        itemLoadWindows.set(requestId, {
          payload,
          window: childWindow,
          resolve,
          resolved: false,
        });

        childWindow.on("closed", () => {
          finishItemLoadWindow(requestId, null);
        });
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
