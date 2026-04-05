import { ipcMain } from "electron";
import { clientBackendService } from "../services/clientBackendService.ts";
import { itemBackendService } from "../services/itemBackendService.ts";
import { ticketBackendService } from "../services/ticketBackendService.ts";

const CHANNELS = {
  SEARCH_CLIENTS: "search-clients",
  GET_CITIES: "get-cities",
  GET_HAIR_COLORS: "get-hair-colors",
  GET_EYE_COLORS: "get-eye-colors",
  GET_ID_TYPES: "get-id-types",
  GET_LOCATIONS: "get-locations",
  ADD_CLIENT: "add-client",
  UPDATE_CLIENT: "update-client",
  DELETE_CLIENT: "delete-client",
  SAVE_CLIENT_IMAGE: "save-client-image",
  GET_CLIENT_IMAGE: "get-client-image",
  GET_TICKETS: "get-tickets",
  GET_ITEMS: "get-items",
  ADD_PAWN_TICKET: "add-pawn-ticket",
  ADD_SELL_TICKET: "add-sell-ticket",
  UPDATE_TICKET: "update-ticket",
} as const;

export const registerIpcHandlers = () => {
  ipcMain.handle(
    CHANNELS.SEARCH_CLIENTS,
    async (_event, firstName: string, lastName: string) => {
      return clientBackendService.searchClients(firstName, lastName);
    },
  );

  ipcMain.handle(CHANNELS.GET_CITIES, async () =>
    clientBackendService.loadCities(),
  );
  ipcMain.handle(CHANNELS.GET_HAIR_COLORS, async () =>
    clientBackendService.loadHairColors(),
  );
  ipcMain.handle(CHANNELS.GET_EYE_COLORS, async () =>
    clientBackendService.loadEyeColors(),
  );
  ipcMain.handle(CHANNELS.GET_ID_TYPES, async () =>
    clientBackendService.loadIdTypes(),
  );
  ipcMain.handle(CHANNELS.GET_LOCATIONS, async () =>
    ticketBackendService.loadLocations(),
  );
  ipcMain.handle(CHANNELS.ADD_CLIENT, async (_event, payload) => {
    return clientBackendService.createClient(payload);
  });
  ipcMain.handle(CHANNELS.UPDATE_CLIENT, async (_event, payload) => {
    return clientBackendService.updateClient(payload);
  });
  ipcMain.handle(
    CHANNELS.DELETE_CLIENT,
    async (_event, clientNumber: number) => {
      return clientBackendService.deleteClient(clientNumber);
    },
  );
  ipcMain.handle(
    CHANNELS.SAVE_CLIENT_IMAGE,
    async (_event, fileName: string, base64: string) => {
      return clientBackendService.saveClientImage(fileName, base64);
    },
  );
  ipcMain.handle(
    CHANNELS.GET_CLIENT_IMAGE,
    async (_event, imagePath: string) => {
      return clientBackendService.loadClientImage(imagePath);
    },
  );
  ipcMain.handle(CHANNELS.GET_TICKETS, async (_event, clientNumber: number) => {
    return ticketBackendService.loadTickets(clientNumber);
  });
  ipcMain.handle(CHANNELS.GET_ITEMS, async (_event, ticketNumber: number) => {
    return itemBackendService.loadItems(ticketNumber);
  });
  ipcMain.handle(CHANNELS.ADD_PAWN_TICKET, async (_event, payload) => {
    return ticketBackendService.createPawnTicket(payload);
  });
  ipcMain.handle(CHANNELS.ADD_SELL_TICKET, async (_event, payload) => {
    return ticketBackendService.createSellTicket(payload);
  });
  ipcMain.handle(CHANNELS.UPDATE_TICKET, async (_event, payload) => {
    return ticketBackendService.updateTicket(payload);
  });
};
