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
  GET_ITEM_CATEGORIES: "get-item-categories",
  ADD_ITEM: "add-item",
  UPDATE_ITEM: "update-item",
  DELETE_ITEM: "delete-item",
  SAVE_ITEM_IMAGE: "save-item-image",
  GET_ITEM_IMAGE: "get-item-image",
  OPEN_ITEM_LOAD_WINDOW: "open-item-load-window",
  GET_ITEM_LOAD_WINDOW_PAYLOAD: "get-item-load-window-payload",
  SUBMIT_ITEM_LOAD_WINDOW: "submit-item-load-window",
  CANCEL_ITEM_LOAD_WINDOW: "cancel-item-load-window",
  ADD_PAWN_TICKET: "add-pawn-ticket",
  ADD_SELL_TICKET: "add-sell-ticket",
  UPDATE_TICKET: "update-ticket",
  CONVERT_TICKET: "convert-ticket",
  EXPIRE_TICKET: "expire-ticket",
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
  expire: (payload) => invoke(CHANNELS.EXPIRE_TICKET, payload),
  loadTransferPreview: (ticketNumber) =>
    invoke(CHANNELS.GET_TRANSFER_TICKET_PREVIEW, ticketNumber),
  transfer: (payload) => invoke(CHANNELS.TRANSFER_TICKET, payload),
};

const itemApi = {
  loadByTicket: (ticketNumber) => invoke(CHANNELS.GET_ITEMS, ticketNumber),
  loadCategories: () => invoke(CHANNELS.GET_ITEM_CATEGORIES),
  create: (payload) => invoke(CHANNELS.ADD_ITEM, payload),
  update: (payload) => invoke(CHANNELS.UPDATE_ITEM, payload),
  delete: (ticketNumber, itemNumber) =>
    invoke(CHANNELS.DELETE_ITEM, ticketNumber, itemNumber),
  saveImage: (fileName, base64) =>
    invoke(CHANNELS.SAVE_ITEM_IMAGE, fileName, base64),
  loadImage: (imagePath) => invoke(CHANNELS.GET_ITEM_IMAGE, imagePath),
};

const windowApi = {
  openItemLoadWindow: (payload) =>
    invoke(CHANNELS.OPEN_ITEM_LOAD_WINDOW, payload),
  loadItemLoadWindowPayload: (requestId) =>
    invoke(CHANNELS.GET_ITEM_LOAD_WINDOW_PAYLOAD, requestId),
  submitItemLoadWindow: (requestId, selectedItemIds) =>
    invoke(CHANNELS.SUBMIT_ITEM_LOAD_WINDOW, requestId, selectedItemIds),
  cancelItemLoadWindow: (requestId) =>
    invoke(CHANNELS.CANCEL_ITEM_LOAD_WINDOW, requestId),
};

contextBridge.exposeInMainWorld("electronAPI", {
  client: clientApi,
  ticket: ticketApi,
  item: itemApi,
  window: windowApi,
});

console.log("Preload (CJS) loaded");
