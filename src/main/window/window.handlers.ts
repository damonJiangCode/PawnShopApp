import type { IpcMainInvokeEvent } from "electron";
import type {
  OpenItemSearchWindowInput,
  OpenPaymentWindowInput,
} from "../../shared/payload-contracts/window.contract.ts";
import type { Item } from "../../shared/models/item.model.ts";
import { CHANNELS } from "../ipc/channels.ts";
import { openWindowHost } from "./openWindowHost.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

const ITEM_SEARCH_WINDOW_X = 24;
const ITEM_SEARCH_WINDOW_Y = 24;

let activeItemSearchWindow: Electron.BrowserWindow | null = null;
let itemSearchWindowInput: OpenItemSearchWindowInput | null = null;

const getItemRowId = (item: Item): number | string | undefined =>
  item.draft_id ?? item.item_number;

const mergeItemSearchInput = (
  currentInput: OpenItemSearchWindowInput | null,
  nextInput?: OpenItemSearchWindowInput,
): OpenItemSearchWindowInput | null => {
  if (!nextInput) {
    return currentInput;
  }

  const existingIds = new Set(
    (currentInput?.items ?? [])
      .map(getItemRowId)
      .filter((id): id is number | string => id !== undefined)
      .map(String),
  );
  const nextItems = nextInput.items.filter((item) => {
    const id = getItemRowId(item);
    return id === undefined || !existingIds.has(String(id));
  });

  return {
    sourceTicketNumber: nextInput.sourceTicketNumber,
    items: [...(currentInput?.items ?? []), ...nextItems],
    mode: nextInput.mode ?? currentInput?.mode ?? "search",
  };
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
    async (_event: IpcMainInvokeEvent, input?: OpenItemSearchWindowInput) => {
      itemSearchWindowInput = mergeItemSearchInput(
        itemSearchWindowInput,
        input,
      );

      if (activeItemSearchWindow && !activeItemSearchWindow.isDestroyed()) {
        activeItemSearchWindow.setPosition(
          ITEM_SEARCH_WINDOW_X,
          ITEM_SEARCH_WINDOW_Y,
        );
        activeItemSearchWindow.show();
        activeItemSearchWindow.focus();
        activeItemSearchWindow.webContents.send(
          CHANNELS.NOTIFY_ITEM_SEARCH_WINDOW_INPUT_UPDATED,
        );
        return;
      }

      activeItemSearchWindow = openWindowHost({
        screen: "item-search",
        title: "Search Item",
        description: "Search by item number or item detail.",
        width: 1180,
        height: 660,
        x: ITEM_SEARCH_WINDOW_X,
        y: ITEM_SEARCH_WINDOW_Y,
        minWidth: 1040,
        minHeight: 520,
      });

      activeItemSearchWindow.on("closed", () => {
        activeItemSearchWindow = null;
        itemSearchWindowInput = null;
      });
    },
  );

  ipcMain.handle(CHANNELS.GET_ITEM_SEARCH_WINDOW_INPUT, async () => {
    return itemSearchWindowInput;
  });
};
