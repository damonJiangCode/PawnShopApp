import type { Item } from "../types/Item.ts";
import type {
  ItemLoadWindowPayload,
  PaymentWindowPayload,
} from "../types/windowPayload.ts";

export type ElectronWindowApi = {
  openPaymentWindow: (payload: PaymentWindowPayload) => Promise<void>;
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
