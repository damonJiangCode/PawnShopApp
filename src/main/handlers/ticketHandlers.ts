import { ipcMain } from "electron";
import { ticketService } from "../services/ticketService.ts";
import { CHANNELS } from "./channels.ts";

export const registerTicketHandlers = () => {
  ipcMain.handle(CHANNELS.GET_LOCATIONS, async () =>
    ticketService.loadLocations(),
  );
  ipcMain.handle(CHANNELS.GET_TICKETS, async (_event, clientNumber: number) => {
    return ticketService.loadTickets(clientNumber);
  });
  ipcMain.handle(CHANNELS.ADD_PAWN_TICKET, async (_event, payload) => {
    return ticketService.createPawnTicket(payload);
  });
  ipcMain.handle(CHANNELS.ADD_SELL_TICKET, async (_event, payload) => {
    return ticketService.createSellTicket(payload);
  });
  ipcMain.handle(CHANNELS.UPDATE_TICKET, async (_event, payload) => {
    return ticketService.updateTicket(payload);
  });
};
