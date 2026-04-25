import type { Item } from "../../shared/types/Item.ts";
import type {
  ItemCategoryOption,
  SaveItemInput,
} from "../../shared/ipc/itemApi.ts";
import { itemRepo } from "../repos/itemRepo.ts";
import { runInTransaction } from "../utils/runInTransaction.ts";
import { imageStorage } from "../utils/imageStorage.ts";

const normalizeSaveItemInput = (input: SaveItemInput): SaveItemInput => ({
  item_number: input.item_number ? Number(input.item_number) : undefined,
  ticket_number: Number(input.ticket_number),
  quantity: Number(input.quantity),
  subcategory_id: Number(input.subcategory_id),
  description: input.description?.trim().toUpperCase() ?? "",
  brand_name: input.brand_name?.trim().toUpperCase() ?? "",
  model_number: input.model_number?.trim().toUpperCase() ?? "",
  serial_number: input.serial_number?.trim().toUpperCase() ?? "",
  amount: Number(input.amount),
  image_path: input.image_path?.trim() ?? "",
});

const validateItem = (item: SaveItemInput) => {
  if (!Number.isFinite(item.ticket_number) || item.ticket_number <= 0) {
    throw new Error("A ticket is required.");
  }

  if (!Number.isFinite(item.subcategory_id) || item.subcategory_id <= 0) {
    throw new Error("Select a category.");
  }

  if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
    throw new Error("Quantity must be greater than 0.");
  }

  if (!item.description) {
    throw new Error("Description is required.");
  }

  if (!Number.isFinite(item.amount) || item.amount < 0) {
    throw new Error("Price must be greater than 0.");
  }
};

export const itemService = {
  loadItems: async (ticketNumber: number): Promise<Item[]> => {
    if (!ticketNumber) {
      return [];
    }

    return itemRepo.loadByTicketNumber(ticketNumber);
  },

  loadCategories: async (): Promise<ItemCategoryOption[]> => {
    return itemRepo.loadCategories();
  },

  createItem: async (input: SaveItemInput): Promise<Item> => {
    const normalizedInput = normalizeSaveItemInput(input);
    validateItem(normalizedInput);

    return runInTransaction("createItem", async (client) => {
      const item = await itemRepo.create(normalizedInput, client);
      const imagePath = item.image_path
        ? await imageStorage.finalizeItemImage(item.item_number, item.image_path)
        : "";

      if (imagePath && imagePath !== item.image_path) {
        await itemRepo.updateImagePath(item.item_number, imagePath, client);
      }

      return {
        ...item,
        image_path: imagePath || item.image_path,
      };
    });
  },

  updateItem: async (input: SaveItemInput): Promise<Item> => {
    const normalizedInput = normalizeSaveItemInput(input);
    validateItem(normalizedInput);

    if (!normalizedInput.item_number) {
      throw new Error("An item is required.");
    }

    return runInTransaction("updateItem", async (client) => {
      const imagePath = normalizedInput.image_path
        ? await imageStorage.finalizeItemImage(
            normalizedInput.item_number as number,
            normalizedInput.image_path,
          )
        : "";
      const preparedInput = {
        ...normalizedInput,
        image_path: imagePath || normalizedInput.image_path,
      };

      return itemRepo.update(preparedInput, client);
    });
  },

  deleteItem: async (
    ticketNumber: number,
    itemNumber: number,
  ): Promise<void> => {
    if (!ticketNumber || !itemNumber) {
      throw new Error("A ticket and item are required.");
    }

    return runInTransaction("deleteItem", async (client) =>
      itemRepo.delete(Number(ticketNumber), Number(itemNumber), client),
    );
  },

  saveItemImage: async (fileName: string, base64: string): Promise<string> => {
    return imageStorage.saveItemImage(fileName, base64);
  },

  loadItemImage: async (imagePath: string): Promise<string> => {
    return imageStorage.loadItemImage(imagePath);
  },
};
