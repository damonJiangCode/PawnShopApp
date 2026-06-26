import type { Item } from "../types/Item.ts";
import type {
  ItemLoadWindowData,
  OpenPaymentWindowInput,
} from "../types/windowApiTypes.ts";

export type ElectronWindowApi = {
  openPaymentWindow: (input: OpenPaymentWindowInput) => Promise<void>;
  openItemLoadWindow: (
    input: ItemLoadWindowData,
  ) => Promise<Item[] | null>;
  loadItemLoadWindowData: (
    requestId: string,
  ) => Promise<ItemLoadWindowData | null>;
  submitItemLoadWindow: (
    requestId: string,
    selectedItemIds: Array<number | string>,
  ) => Promise<void>;
  cancelItemLoadWindow: (requestId: string) => Promise<void>;
};
