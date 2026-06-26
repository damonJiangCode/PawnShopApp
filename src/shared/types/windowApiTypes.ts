import type { Item } from "./Item.ts";

export type ItemLoadWindowData = {
  title: string;
  description?: string;
  actionLabel: string;
  items: Item[];
};

export type OpenPaymentWindowInput = {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
};
