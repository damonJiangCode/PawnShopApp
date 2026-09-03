import type {
  OpenItemSearchWindowInput,
  OpenPaymentWindowInput,
} from "../payload-contracts/window.contract.ts";

export type WindowApi = {
  openPaymentWindow: (input: OpenPaymentWindowInput) => Promise<void>;
  onPaymentWindowInputUpdated: (
    callback: (input: OpenPaymentWindowInput) => void,
  ) => () => void;
  openTicketSearchWindow: () => Promise<void>;
  openItemSearchWindow: (input?: OpenItemSearchWindowInput) => Promise<void>;
  getItemSearchWindowInput: () => Promise<OpenItemSearchWindowInput | null>;
  onItemSearchWindowInputUpdated: (callback: () => void) => () => void;
};
