import type { Item } from "../../../shared/types/Item";
import type {
  ItemSearchInput,
  ItemCategoryOption,
  SaveItemInput,
} from "../../../shared/types/itemApiTypes";
import { getElectronApi } from "../../shared/api/electron.api";

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

  searchItems: async (input: ItemSearchInput): Promise<Item[]> => {
    const api = getElectronApi()?.item;
    if (!api) {
      return [];
    }

    return api.search({
      item_number: input.item_number ? Number(input.item_number) : undefined,
      brand_name: input.brand_name?.trim() ?? "",
      model_number: input.model_number?.trim() ?? "",
      serial_number: input.serial_number?.trim() ?? "",
    });
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

  deleteItem: async (
    ticketNumber: number,
    itemNumber: number,
  ): Promise<void> => {
    const api = getElectronApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.delete(ticketNumber, itemNumber);
  },

  linkItemsToTicket: async (
    ticketNumber: number,
    itemNumbers: number[],
  ): Promise<Item[]> => {
    const api = getElectronApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.linkToTicket(ticketNumber, itemNumbers);
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

export type { ItemCategoryOption, ItemSearchInput, SaveItemInput };
