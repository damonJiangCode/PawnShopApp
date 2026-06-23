import type { IpcMainInvokeEvent } from "electron";
import type {
  ConvertTicketInput,
  BuybackReportInput,
  ExtendTicketsInput,
  ExpireTicketInput,
  MarkTicketStolenInput,
  PickupTicketsInput,
  CreatePawnTicketInput,
  CreateSellTicketInput,
  TransferTicketInput,
  UpdateTicketInput,
} from "../../shared/types/ticketPayload.ts";
import type { SaveHolidayInput } from "../../shared/types/holidayDate.ts";
import type { SaveLocationInput } from "../../shared/types/location.ts";
import { ticketService } from "../services/ticketService.ts";
import { CHANNELS } from "./channels.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerTicketHandlers = () => {
  ipcMain.handle(CHANNELS.GET_LOCATIONS, async () =>
    ticketService.loadLocations(),
  );
  ipcMain.handle(CHANNELS.GET_ADMIN_LOCATIONS, async () =>
    ticketService.loadAdminLocations(),
  );
  ipcMain.handle(
    CHANNELS.ADD_LOCATION,
    async (_event: IpcMainInvokeEvent, input: SaveLocationInput) =>
      ticketService.addLocation(input),
  );
  ipcMain.handle(
    CHANNELS.DEACTIVATE_LOCATION,
    async (_event: IpcMainInvokeEvent, location: string) =>
      ticketService.deactivateLocation(location),
  );
  ipcMain.handle(CHANNELS.GET_HOLIDAY_DATES, async () =>
    ticketService.loadHolidayDates(),
  );
  ipcMain.handle(
    CHANNELS.ADD_HOLIDAY_DATE,
    async (_event: IpcMainInvokeEvent, input: SaveHolidayInput) =>
      ticketService.addHolidayDate(input),
  );
  ipcMain.handle(
    CHANNELS.DELETE_HOLIDAY_DATE,
    async (_event: IpcMainInvokeEvent, holidayDate: string) =>
      ticketService.deleteHolidayDate(holidayDate),
  );
  ipcMain.handle(
    CHANNELS.GET_TICKETS,
    async (_event: IpcMainInvokeEvent, clientNumber: number) => {
      return ticketService.loadTickets(clientNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.SEARCH_PAYMENT_TICKET,
    async (_event: IpcMainInvokeEvent, ticketNumber: number) => {
      return ticketService.searchPaymentTicket(ticketNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.LOAD_BUYBACK_REPORT,
    async (_event: IpcMainInvokeEvent, input: BuybackReportInput) => {
      return ticketService.loadBuybackReport(input);
    },
  );
  ipcMain.handle(
    CHANNELS.SEARCH_TICKET,
    async (_event: IpcMainInvokeEvent, ticketNumber: number) => {
      return ticketService.searchTicket(ticketNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.ADD_PAWN_TICKET,
    async (_event: IpcMainInvokeEvent, payload: CreatePawnTicketInput) => {
      return ticketService.createPawnTicket(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.ADD_SELL_TICKET,
    async (_event: IpcMainInvokeEvent, payload: CreateSellTicketInput) => {
      return ticketService.createSellTicket(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.UPDATE_TICKET,
    async (_event: IpcMainInvokeEvent, payload: UpdateTicketInput) => {
      return ticketService.updateTicket(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.CONVERT_TICKET,
    async (_event: IpcMainInvokeEvent, payload: ConvertTicketInput) => {
      return ticketService.convertTicket(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.EXPIRE_TICKET,
    async (_event: IpcMainInvokeEvent, payload: ExpireTicketInput) => {
      return ticketService.expireTicket(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.MARK_TICKET_STOLEN,
    async (_event: IpcMainInvokeEvent, payload: MarkTicketStolenInput) => {
      return ticketService.markTicketStolen(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.PICKUP_TICKETS,
    async (_event: IpcMainInvokeEvent, payload: PickupTicketsInput) => {
      return ticketService.pickupTickets(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.EXTEND_TICKETS,
    async (_event: IpcMainInvokeEvent, payload: ExtendTicketsInput) => {
      return ticketService.extendTickets(payload);
    },
  );
  ipcMain.handle(
    CHANNELS.GET_TRANSFER_TICKET_PREVIEW,
    async (_event: IpcMainInvokeEvent, ticketNumber: number) => {
      return ticketService.loadTransferTicketPreview(ticketNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.TRANSFER_TICKET,
    async (_event: IpcMainInvokeEvent, payload: TransferTicketInput) => {
      return ticketService.transferTicket(payload);
    },
  );
};
