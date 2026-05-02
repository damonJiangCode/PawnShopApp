import type { ItemLoadWindowPayload } from "../../shared/types/windowPayload";
import type { Item } from "../../shared/types/Item";
import { getElectronApi } from "./electronApi";

export const windowService = {
  openItemLoadWindow: async (
    payload: ItemLoadWindowPayload,
  ): Promise<Item[] | null> => {
    const api = getElectronApi()?.window;

    if (!api) {
      throw new Error("Window API is unavailable.");
    }

    return api.openItemLoadWindow(payload);
  },

  loadItemLoadWindowPayload: async (
    requestId: string,
  ): Promise<ItemLoadWindowPayload | null> => {
    const api = getElectronApi()?.window;

    if (!api) {
      return null;
    }

    return api.loadItemLoadWindowPayload(requestId);
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
