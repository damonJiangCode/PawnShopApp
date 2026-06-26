import type { Item } from "../types/Item.ts";
import type {
  ItemCategoryOption,
  ItemSearchInput,
  SaveItemInput,
} from "../types/itemApiTypes.ts";

export type ElectronItemApi = {
  loadByTicket: (ticketNumber: number) => Promise<Item[]>;
  loadCategories: () => Promise<ItemCategoryOption[]>;
  search: (input: ItemSearchInput) => Promise<Item[]>;
  create: (input: SaveItemInput) => Promise<Item>;
  update: (input: SaveItemInput) => Promise<Item>;
  delete: (ticketNumber: number, itemNumber: number) => Promise<void>;
  linkToTicket: (
    ticketNumber: number,
    itemNumbers: number[],
  ) => Promise<Item[]>;
  saveImage: (fileName: string, base64: string) => Promise<string>;
  loadImage: (imagePath: string) => Promise<string>;
};
