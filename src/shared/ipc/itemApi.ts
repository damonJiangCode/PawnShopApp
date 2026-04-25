import type { Item } from "../types/Item.ts";

export type ItemCategoryOption = {
  category_id: number;
  category_name: string;
  subcategory_id: number;
  subcategory_name: string;
};

export type SaveItemInput = {
  item_number?: number;
  ticket_number: number;
  quantity: number;
  subcategory_id: number;
  description: string;
  brand_name: string;
  model_number: string;
  serial_number: string;
  amount: number;
  image_path?: string;
};

export type ElectronItemApi = {
  loadByTicket: (ticketNumber: number) => Promise<Item[]>;
  loadCategories: () => Promise<ItemCategoryOption[]>;
  create: (payload: SaveItemInput) => Promise<Item>;
  update: (payload: SaveItemInput) => Promise<Item>;
  delete: (ticketNumber: number, itemNumber: number) => Promise<void>;
  saveImage: (fileName: string, base64: string) => Promise<string>;
  loadImage: (imagePath: string) => Promise<string>;
};
