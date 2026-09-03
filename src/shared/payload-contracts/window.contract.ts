import type { Item } from "../models/item.model.ts";

export type OpenItemSearchWindowInput = {
  sourceTicketNumber?: number;
  items: Item[];
  mode?: "repawn" | "load" | "search";
  focusWindow?: boolean;
};

export type OpenPaymentWindowInput = {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
};

export type PaymentCompletedEvent = {
  type: "payment-completed";
  pickedUpCounts: Array<{
    clientNumber: number;
    count: number;
  }>;
};
