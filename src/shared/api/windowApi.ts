import type { Item } from "../models/item.model.ts";
import type {
  ItemLoadWindowData,
  OpenPaymentWindowInput,
} from "../contracts/window.contract.ts";

export type WindowApi = {
  openPaymentWindow: (input: OpenPaymentWindowInput) => Promise<void>;
  openTicketSearchWindow: () => Promise<void>;
  openItemSearchWindow: () => Promise<void>;
  openItemLoadWindow: (
    input: ItemLoadWindowData,
  ) => Promise<Item[] | null>;
  loadItemLoadWindowData: (
    requestId: string,
  ) => Promise<ItemLoadWindowData | null>;
  subscribeToItemLoadWindowDataUpdated: (
    callback: (requestId: string) => void,
  ) => () => void;
  submitItemLoadWindow: (
    requestId: string,
    selectedItemIds: Array<number | string>,
  ) => Promise<void>;
  cancelItemLoadWindow: (requestId: string) => Promise<void>;
};
