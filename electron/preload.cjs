const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = {
  SEARCH_CLIENTS: "search-clients",
  GET_CITIES: "get-cities",
  GET_HAIR_COLORS: "get-hair-colors",
  GET_EYE_COLORS: "get-eye-colors",
  GET_ID_TYPES: "get-id-types",
  ADD_CLIENT: "add-client",
  UPDATE_CLIENT: "update-client",
  DELETE_CLIENT: "delete-client",
  SAVE_CLIENT_IMAGE: "save-client-image",
  GET_CLIENT_IMAGE: "get-client-image",
  VERIFY_EMPLOYEE_PASSWORD: "verify-employee-password",
  GET_TICKETS: "get-tickets",
};

contextBridge.exposeInMainWorld("electronAPI", {
  searchClients: (firstName, lastName) =>
    ipcRenderer.invoke(CHANNELS.SEARCH_CLIENTS, firstName, lastName),
  getCities: () => ipcRenderer.invoke(CHANNELS.GET_CITIES),
  getHairColors: () => ipcRenderer.invoke(CHANNELS.GET_HAIR_COLORS),
  getEyeColors: () => ipcRenderer.invoke(CHANNELS.GET_EYE_COLORS),
  getIdTypes: () => ipcRenderer.invoke(CHANNELS.GET_ID_TYPES),
  addClient: (payload) => ipcRenderer.invoke(CHANNELS.ADD_CLIENT, payload),
  updateClient: (payload) =>
    ipcRenderer.invoke(CHANNELS.UPDATE_CLIENT, payload),
  deleteClient: (clientNumber) =>
    ipcRenderer.invoke(CHANNELS.DELETE_CLIENT, clientNumber),
  verifyEmployeePassword: (password) =>
    ipcRenderer.invoke(CHANNELS.VERIFY_EMPLOYEE_PASSWORD, password),
  saveClientImage: (fileName, base64) =>
    ipcRenderer.invoke(CHANNELS.SAVE_CLIENT_IMAGE, fileName, base64),
  getClientImage: (imagePath) =>
    ipcRenderer.invoke(CHANNELS.GET_CLIENT_IMAGE, imagePath),
  getTickets: (clientNumber) =>
    ipcRenderer.invoke(CHANNELS.GET_TICKETS, clientNumber),
});

console.log("Preload (CJS) loaded");
