import type { Item } from "../types/Item.ts";
import type { ItemCategoryOption, SaveItemInput } from "../types/itemPayload.ts";

export type ElectronItemApi = {
  loadByTicket: (ticketNumber: number) => Promise<Item[]>;
  loadCategories: () => Promise<ItemCategoryOption[]>;
  create: (payload: SaveItemInput) => Promise<Item>;
  update: (payload: SaveItemInput) => Promise<Item>;
  delete: (ticketNumber: number, itemNumber: number) => Promise<void>;
  saveImage: (fileName: string, base64: string) => Promise<string>;
  loadImage: (imagePath: string) => Promise<string>;
};
