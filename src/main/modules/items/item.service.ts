import type { Item } from "../../../shared/models/item.model.ts";
import type {
  ItemSearchInput,
  ItemCategoryOption,
  ItemSearchResult,
  SaveItemInput,
} from "../../../shared/payload-contracts/item.contract.ts";
import { itemRepo } from "./item.repo.ts";
import { runInTransaction } from "../../shared/runInTransaction.ts";
import { imageStorage } from "../../shared/imageStorage.ts";
import { itemInput } from "./item.input.ts";
import { ticketRepo } from "../tickets/ticket.repo.ts";
import type { DbClient } from "../../database/connection.ts";
import { createFieldError } from "../../shared/createFieldError.ts";

const assertEditableTicket = async (ticketNumber: number, client: DbClient) => {
  const ticket = await ticketRepo.loadByTicketNumberForUpdate(
    ticketNumber,
    client,
  );

  if (!ticket) {
    throw createFieldError(
      "ticket_number",
      `Ticket #${ticketNumber} was not found.`,
    );
  }

  if (ticket.status !== "pawned" && ticket.status !== "sold") {
    throw createFieldError(
      "ticket_number",
      "Items can only be changed on an active ticket.",
    );
  }

  return ticket;
};

const finalizeSavedItemImage = async (item: Item, ticketNumber: number) => {
  const stagedImagePath = item.image_path ?? "";
  let finalizedImagePath = "";

  if (!stagedImagePath) {
    return item;
  }

  try {
    finalizedImagePath = await imageStorage.finalizeItemImage(
      item.item_number,
      stagedImagePath,
    );

    if (!finalizedImagePath || finalizedImagePath === stagedImagePath) {
      return item;
    }

    await runInTransaction("finalizeItemImage", async (client) =>
      itemRepo.updateImagePath(
        item.item_number,
        finalizedImagePath,
        ticketNumber,
        client,
      ),
    );

    try {
      await imageStorage.removeStagedImage(stagedImagePath);
    } catch (error) {
      console.error("[image] Unable to remove staged item image:", error);
    }

    return { ...item, image_path: finalizedImagePath };
  } catch (error) {
    if (finalizedImagePath && finalizedImagePath !== stagedImagePath) {
      await imageStorage
        .removeFinalizedImage("item", finalizedImagePath)
        .catch((cleanupError) => {
          console.error(
            "[image] Unable to remove unused finalized item image:",
            cleanupError,
          );
        });
    }
    console.error(
      "[image] Unable to finalize item image; keeping staged image:",
      error,
    );
    return item;
  }
};

export const itemService = {
  loadItems: async (ticketNumber: number): Promise<Item[]> => {
    if (!ticketNumber) {
      return [];
    }

    return itemRepo.loadByTicketNumber(ticketNumber);
  },

  loadItemCategories: async (): Promise<ItemCategoryOption[]> => {
    return itemRepo.loadCategories();
  },

  searchItems: async (input: ItemSearchInput): Promise<ItemSearchResult> => {
    const normalizedInput = itemInput.normalizeItemSearch(input);

    if (
      normalizedInput.item_number &&
      (!Number.isFinite(normalizedInput.item_number) ||
        normalizedInput.item_number <= 0)
    ) {
      throw createFieldError("item_number", "Enter a valid item number.");
    }

    return itemRepo.search(normalizedInput);
  },

  createItem: async (input: SaveItemInput): Promise<Item> => {
    const normalizedInput = itemInput.normalizeSaveItem(input);
    itemInput.validateItem(normalizedInput);

    const item = await runInTransaction("createItem", async (client) => {
      await assertEditableTicket(normalizedInput.ticket_number, client);
      return itemRepo.create(normalizedInput, client);
    });
    return finalizeSavedItemImage(item, normalizedInput.ticket_number);
  },

  updateItem: async (input: SaveItemInput): Promise<Item> => {
    const normalizedInput = itemInput.normalizeSaveItem(input);
    itemInput.validateItem(normalizedInput);

    if (!normalizedInput.item_number) {
      throw createFieldError("item_number", "An item is required.");
    }

    const item = await runInTransaction("updateItem", async (client) => {
      await assertEditableTicket(normalizedInput.ticket_number, client);
      return itemRepo.update(normalizedInput, client);
    });
    return finalizeSavedItemImage(item, normalizedInput.ticket_number);
  },

  deleteItem: async (
    ticketNumber: number,
    itemNumber: number,
  ): Promise<void> => {
    if (!ticketNumber || !itemNumber) {
      throw createFieldError("form", "A ticket and item are required.");
    }

    return runInTransaction("deleteItem", async (client) => {
      await assertEditableTicket(Number(ticketNumber), client);
      await itemRepo.delete(Number(ticketNumber), Number(itemNumber), client);
    });
  },

  linkItemsToTicket: async (
    ticketNumber: number,
    itemNumbers: number[],
  ): Promise<Item[]> => {
    const normalizedInput = itemInput.normalizeTicketItemNumbers(
      ticketNumber,
      itemNumbers,
    );

    if (
      !Number.isFinite(normalizedInput.ticketNumber) ||
      normalizedInput.ticketNumber <= 0
    ) {
      throw createFieldError("ticket_number", "A ticket is required.");
    }

    if (!normalizedInput.itemNumbers.length) {
      return [];
    }

    return runInTransaction("linkItemsToTicket", async (client) => {
      await assertEditableTicket(normalizedInput.ticketNumber, client);
      const linkedItems: Item[] = [];

      for (const itemNumber of [...normalizedInput.itemNumbers].sort(
        (left, right) => left - right,
      )) {
        const linkedItem = await itemRepo.linkItemToTicket(
          normalizedInput.ticketNumber,
          itemNumber,
          client,
        );
        linkedItems.push(linkedItem);
      }

      return linkedItems;
    });
  },

  saveItemImage: async (fileName: string, base64: string): Promise<string> => {
    return imageStorage.saveItemImage(fileName, base64);
  },
};
