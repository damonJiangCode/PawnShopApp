import type { Item } from "../../shared/types/Item";
import type {
  ItemCategoryOption,
  SaveItemInput,
} from "../../shared/ipc/itemApi";
import { getElectronApi } from "./electronApi";

let categoryCache: ItemCategoryOption[] | null = null;
let categoryPromise: Promise<ItemCategoryOption[]> | null = null;

export const itemService = {
  loadItems: async (ticketNumber?: number): Promise<Item[]> => {
    try {
      if (!ticketNumber) {
        return [];
      }

      const api = getElectronApi()?.item;
      if (!api) {
        return [];
      }

      return await api.loadByTicket(ticketNumber);
    } catch {
      return [];
    }
  },

  preloadCategories: async (): Promise<ItemCategoryOption[]> => {
    if (categoryCache) {
      return categoryCache;
    }

    if (categoryPromise) {
      return categoryPromise;
    }

    const api = getElectronApi()?.item;
    if (!api) {
      categoryCache = [];
      return categoryCache;
    }

    categoryPromise = api.loadCategories().then((categories) => {
      categoryCache = categories;
      categoryPromise = null;
      return categories;
    });

    return categoryPromise;
  },

  createItem: async (payload: SaveItemInput): Promise<Item> => {
    const api = getElectronApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.create(payload);
  },

  updateItem: async (payload: SaveItemInput): Promise<Item> => {
    const api = getElectronApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.update(payload);
  },

  deleteItem: async (ticketNumber: number, itemNumber: number): Promise<void> => {
    const api = getElectronApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.delete(ticketNumber, itemNumber);
  },

  saveItemImage: async (fileName: string, base64: string): Promise<string> => {
    const api = getElectronApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.saveImage(fileName, base64);
  },

  loadItemImage: async (imagePath: string): Promise<string> => {
    const api = getElectronApi()?.item;
    if (!api) {
      return "";
    }

    return api.loadImage(imagePath);
  },
};

export type { ItemCategoryOption, SaveItemInput };
