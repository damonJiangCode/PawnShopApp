import type { Item } from "./Item.ts";

export type ItemLoadWindowPayload = {
  title: string;
  description?: string;
  actionLabel: string;
  items: Item[];
};

export type PaymentWindowPayload = {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
};
