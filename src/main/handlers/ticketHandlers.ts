import type { IpcMainInvokeEvent } from "electron";
import type {
  CreatePawnTicketInput,
  CreateSellTicketInput,
  UpdateTicketInput,
} from "../../shared/ipc/contracts.ts";
import { ticketService } from "../services/ticketService.ts";
import { CHANNELS } from "./channels.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerTicketHandlers = () => {
  ipcMain.handle(CHANNELS.GET_LOCATIONS, async () =>
    ticketService.loadLocations(),
  );
  ipcMain.handle(CHANNELS.GET_TICKETS, async (
    _event: IpcMainInvokeEvent,
    clientNumber: number,
  ) => {
    return ticketService.loadTickets(clientNumber);
  });
  ipcMain.handle(CHANNELS.ADD_PAWN_TICKET, async (
    _event: IpcMainInvokeEvent,
    payload: CreatePawnTicketInput,
  ) => {
    return ticketService.createPawnTicket(payload);
  });
  ipcMain.handle(CHANNELS.ADD_SELL_TICKET, async (
    _event: IpcMainInvokeEvent,
    payload: CreateSellTicketInput,
  ) => {
    return ticketService.createSellTicket(payload);
  });
  ipcMain.handle(CHANNELS.UPDATE_TICKET, async (
    _event: IpcMainInvokeEvent,
    payload: UpdateTicketInput,
  ) => {
    return ticketService.updateTicket(payload);
  });
};
