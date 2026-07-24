import type { Item } from "../../../shared/models/item.model";
import type {
  ItemSearchInput,
  ItemCategoryOption,
  SaveItemInput,
} from "../../../shared/contracts/item.contract";
import { getAppApi } from "../../shared/api/app.api";

let categoryCache: ItemCategoryOption[] | null = null;
let categoryPromise: Promise<ItemCategoryOption[]> | null = null;

export const itemService = {
  loadItems: async (ticketNumber?: number): Promise<Item[]> => {
    try {
      if (!ticketNumber) {
        return [];
      }

      const api = getAppApi()?.item;
      if (!api) {
        return [];
      }

      return await api.loadItemsByTicket(ticketNumber);
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

    const api = getAppApi()?.item;
    if (!api) {
      categoryCache = [];
      return categoryCache;
    }

    categoryPromise = api.loadItemCategories().then((categories) => {
      categoryCache = categories;
      categoryPromise = null;
      return categories;
    });

    return categoryPromise;
  },

  searchItems: async (input: ItemSearchInput): Promise<Item[]> => {
    const api = getAppApi()?.item;
    if (!api) {
      return [];
    }

    return api.searchItems({
      item_number: input.item_number ? Number(input.item_number) : undefined,
      brand_name: input.brand_name?.trim() ?? "",
      model_number: input.model_number?.trim() ?? "",
      serial_number: input.serial_number?.trim() ?? "",
    });
  },

  createItem: async (payload: SaveItemInput): Promise<Item> => {
    const api = getAppApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.createItem(payload);
  },

  updateItem: async (payload: SaveItemInput): Promise<Item> => {
    const api = getAppApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.updateItem(payload);
  },

  deleteItem: async (
    ticketNumber: number,
    itemNumber: number,
  ): Promise<void> => {
    const api = getAppApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.deleteItem(ticketNumber, itemNumber);
  },

  linkItemsToTicket: async (
    ticketNumber: number,
    itemNumbers: number[],
  ): Promise<Item[]> => {
    const api = getAppApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.linkItemsToTicket(ticketNumber, itemNumbers);
  },

  saveItemImage: async (fileName: string, base64: string): Promise<string> => {
    const api = getAppApi()?.item;
    if (!api) {
      throw new Error("Item API is unavailable.");
    }

    return api.saveItemImage(fileName, base64);
  },

  loadItemImage: async (imagePath: string): Promise<string> => {
    const api = getAppApi()?.item;
    if (!api) {
      return "";
    }

    return api.loadItemImage(imagePath);
  },
};

export type { ItemCategoryOption, ItemSearchInput, SaveItemInput };
