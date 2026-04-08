import type { Item } from "../types/Item.ts";

export type ElectronItemApi = {
  loadByTicket: (ticketNumber: number) => Promise<Item[]>;
};
