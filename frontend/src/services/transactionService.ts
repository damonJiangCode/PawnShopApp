import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";
import { getItems, getTickets } from "../api/transactionApi";

const getElectronApi = () => (window as any).electronAPI;

export const loadTickets = async (clientNumber?: number): Promise<Ticket[]> => {
  try {
    if (!clientNumber || !getElectronApi()?.getTickets) return [];
    return await getTickets(clientNumber);
  } catch {
    return [];
  }
};

export const loadItems = async (ticketNumber?: number): Promise<Item[]> => {
  try {
    if (!ticketNumber || !getElectronApi()?.getItems) return [];
    return await getItems(ticketNumber);
  } catch {
    return [];
  }
};
