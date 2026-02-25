import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";

export const getTickets = async (clientNumber: number): Promise<Ticket[]> => {
  return (window as any).electronAPI.getTickets(clientNumber);
};

export const getItems = async (ticketNumber: number): Promise<Item[]> => {
  return (window as any).electronAPI.getItems(ticketNumber);
};
