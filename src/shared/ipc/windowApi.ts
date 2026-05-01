import type { Item } from "../types/Item.ts";
import type { ItemLoadWindowPayload } from "../types/windowPayload.ts";

export type ElectronWindowApi = {
  openItemLoadWindow: (
    payload: ItemLoadWindowPayload,
  ) => Promise<Item[] | null>;
  loadItemLoadWindowPayload: (
    requestId: string,
  ) => Promise<ItemLoadWindowPayload | null>;
  submitItemLoadWindow: (
    requestId: string,
    selectedItemIds: Array<number | string>,
  ) => Promise<void>;
  cancelItemLoadWindow: (requestId: string) => Promise<void>;
};
