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
};

contextBridge.exposeInMainWorld("electronAPI", {
  client: {
    search: (firstName, lastName) =>
      ipcRenderer.invoke(CHANNELS.SEARCH_CLIENTS, firstName, lastName),
    loadCities: () => ipcRenderer.invoke(CHANNELS.GET_CITIES),
    loadHairColors: () => ipcRenderer.invoke(CHANNELS.GET_HAIR_COLORS),
    loadEyeColors: () => ipcRenderer.invoke(CHANNELS.GET_EYE_COLORS),
    loadIdTypes: () => ipcRenderer.invoke(CHANNELS.GET_ID_TYPES),
    create: (payload) => ipcRenderer.invoke(CHANNELS.ADD_CLIENT, payload),
    update: (payload) => ipcRenderer.invoke(CHANNELS.UPDATE_CLIENT, payload),
    delete: (clientNumber) =>
      ipcRenderer.invoke(CHANNELS.DELETE_CLIENT, clientNumber),
    saveImage: (fileName, base64) =>
      ipcRenderer.invoke(CHANNELS.SAVE_CLIENT_IMAGE, fileName, base64),
    loadImage: (imagePath) =>
      ipcRenderer.invoke(CHANNELS.GET_CLIENT_IMAGE, imagePath),
  },
  ticket: {
    loadByClient: (clientNumber) =>
      ipcRenderer.invoke(CHANNELS.GET_TICKETS, clientNumber),
    loadLocations: () => ipcRenderer.invoke(CHANNELS.GET_LOCATIONS),
    createPawn: (payload) =>
      ipcRenderer.invoke(CHANNELS.ADD_PAWN_TICKET, payload),
    createSell: (payload) =>
      ipcRenderer.invoke(CHANNELS.ADD_SELL_TICKET, payload),
    update: (payload) => ipcRenderer.invoke(CHANNELS.UPDATE_TICKET, payload),
  },
  item: {
    loadByTicket: (ticketNumber) =>
      ipcRenderer.invoke(CHANNELS.GET_ITEMS, ticketNumber),
  },
});

console.log("Preload (CJS) loaded");
