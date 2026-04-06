import type { Item } from "../../shared/types/Item.ts";
import { itemRepo } from "../repos/itemRepo.ts";

export const itemService = {
  loadItems: async (ticketNumber: number): Promise<Item[]> => {
    if (!ticketNumber) {
      return [];
    }

    return itemRepo.loadByTicketNumber(ticketNumber);
  },
};
