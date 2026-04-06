import type { Item } from "../../shared/types/Item";
import { getElectronApi } from "./electronApi";

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
};
