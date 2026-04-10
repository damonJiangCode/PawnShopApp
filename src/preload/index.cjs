const { contextBridge, ipcRenderer } = require("electron");

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
  CONVERT_TICKET: "convert-ticket",
  GET_TRANSFER_TICKET_PREVIEW: "get-transfer-ticket-preview",
  TRANSFER_TICKET: "transfer-ticket",
};

const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args);

const clientApi = {
  search: (firstName, lastName) =>
    invoke(CHANNELS.SEARCH_CLIENTS, firstName, lastName),
  loadCities: () => invoke(CHANNELS.GET_CITIES),
  loadHairColors: () => invoke(CHANNELS.GET_HAIR_COLORS),
  loadEyeColors: () => invoke(CHANNELS.GET_EYE_COLORS),
  loadIdTypes: () => invoke(CHANNELS.GET_ID_TYPES),
  create: (payload) => invoke(CHANNELS.ADD_CLIENT, payload),
  update: (payload) => invoke(CHANNELS.UPDATE_CLIENT, payload),
  delete: (clientNumber) => invoke(CHANNELS.DELETE_CLIENT, clientNumber),
  saveImage: (fileName, base64) =>
    invoke(CHANNELS.SAVE_CLIENT_IMAGE, fileName, base64),
  loadImage: (imagePath) => invoke(CHANNELS.GET_CLIENT_IMAGE, imagePath),
};

const ticketApi = {
  loadByClient: (clientNumber) => invoke(CHANNELS.GET_TICKETS, clientNumber),
  loadLocations: () => invoke(CHANNELS.GET_LOCATIONS),
  createPawn: (payload) => invoke(CHANNELS.ADD_PAWN_TICKET, payload),
  createSell: (payload) => invoke(CHANNELS.ADD_SELL_TICKET, payload),
  update: (payload) => invoke(CHANNELS.UPDATE_TICKET, payload),
  convert: (payload) => invoke(CHANNELS.CONVERT_TICKET, payload),
  loadTransferPreview: (ticketNumber) =>
    invoke(CHANNELS.GET_TRANSFER_TICKET_PREVIEW, ticketNumber),
  transfer: (payload) => invoke(CHANNELS.TRANSFER_TICKET, payload),
};

const itemApi = {
  loadByTicket: (ticketNumber) => invoke(CHANNELS.GET_ITEMS, ticketNumber),
};

contextBridge.exposeInMainWorld("electronAPI", {
  client: clientApi,
  ticket: ticketApi,
  item: itemApi,
});

console.log("Preload (CJS) loaded");
