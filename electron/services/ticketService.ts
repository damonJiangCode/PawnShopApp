import { ticketRepository } from "../db/repo/ticketRepo.ts";

export const ticketService = {
  fetchTickets: async (clientNumber: number) =>
    ticketRepository.getTickets(clientNumber),

  fetchEmployeeName: async (employeePassword: string) =>
    ticketRepository.getEmployeeName(employeePassword),
};
