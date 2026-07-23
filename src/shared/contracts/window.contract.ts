import type { Item } from "../models/item.model.ts";

export type ItemLoadWindowData = {
  title: string;
  description?: string;
  actionLabel: string;
  items: Item[];
  mode?: "repawn" | "load";
};

export type OpenPaymentWindowInput = {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
};
