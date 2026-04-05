import type { Item } from "../../shared/types/Item.ts";
import { itemRepo } from "../db/repo/itemRepo.ts";

export const itemBackendService = {
  loadItems: async (ticketNumber: number): Promise<Item[]> => {
    if (!ticketNumber) {
      return [];
    }

    return itemRepo.loadByTicketNumber(ticketNumber);
  },
};
