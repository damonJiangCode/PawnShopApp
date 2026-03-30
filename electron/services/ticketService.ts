import { getTickets } from "../db/repositories/ticketsRepository.ts";

export const fetchTickets = async (clientNumber: number) =>
  getTickets(clientNumber);
