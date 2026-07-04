import type {
  ItemLoadWindowData,
  OpenPaymentWindowInput,
} from "../../../shared/types/windowApiTypes";
import type { Item } from "../../../shared/types/Item";
import { getElectronApi } from "./electron.api";

export const windowService = {
  openPaymentWindow: async (payload: OpenPaymentWindowInput): Promise<void> => {
    const api = getElectronApi()?.window;

    if (!api) {
      throw new Error("Window API is unavailable.");
    }

    return api.openPaymentWindow(payload);
  },

  openTicketSearchWindow: async (): Promise<void> => {
    const api = getElectronApi()?.window;

    if (!api) {
      throw new Error("Window API is unavailable.");
    }

    return api.openTicketSearchWindow();
  },

  openItemSearchWindow: async (): Promise<void> => {
    const api = getElectronApi()?.window;

    if (!api) {
      throw new Error("Window API is unavailable.");
    }

    return api.openItemSearchWindow();
  },

  openItemLoadWindow: async (
    payload: ItemLoadWindowData,
  ): Promise<Item[] | null> => {
    const api = getElectronApi()?.window;

    if (!api) {
      throw new Error("Window API is unavailable.");
    }

    return api.openItemLoadWindow(payload);
  },

  loadItemLoadWindowData: async (
    requestId: string,
  ): Promise<ItemLoadWindowData | null> => {
    const api = getElectronApi()?.window;

    if (!api) {
      return null;
    }

    return api.loadItemLoadWindowData(requestId);
  },

  submitItemLoadWindow: async (
    requestId: string,
    selectedItemIds: Array<number | string>,
  ): Promise<void> => {
    const api = getElectronApi()?.window;

    if (!api) {
      throw new Error("Window API is unavailable.");
    }

    return api.submitItemLoadWindow(requestId, selectedItemIds);
  },

  cancelItemLoadWindow: async (requestId: string): Promise<void> => {
    const api = getElectronApi()?.window;

    if (!api) {
      return;
    }

    return api.cancelItemLoadWindow(requestId);
  },
};
