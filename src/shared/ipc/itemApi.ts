import type { Item } from "../types/Item.ts";
import type {
  ItemCategoryOption,
  ItemSearchInput,
  SaveItemInput,
} from "../types/itemPayload.ts";

export type ElectronItemApi = {
  loadByTicket: (ticketNumber: number) => Promise<Item[]>;
  loadCategories: () => Promise<ItemCategoryOption[]>;
  search: (payload: ItemSearchInput) => Promise<Item[]>;
  create: (payload: SaveItemInput) => Promise<Item>;
  update: (payload: SaveItemInput) => Promise<Item>;
  delete: (ticketNumber: number, itemNumber: number) => Promise<void>;
  linkToTicket: (
    ticketNumber: number,
    itemNumbers: number[],
  ) => Promise<Item[]>;
  saveImage: (fileName: string, base64: string) => Promise<string>;
  loadImage: (imagePath: string) => Promise<string>;
};
