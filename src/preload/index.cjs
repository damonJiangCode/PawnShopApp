const { contextBridge, ipcRenderer } = require("electron");
const { CHANNELS } = require("../shared/ipc/channels.cjs");

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
