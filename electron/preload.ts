const { contextBridge, ipcRenderer } = require("electron");

// define all available ipc channels
const CHANNELS = {
  SEARCH_CUSTOMER: "search-customer",
  GET_IDS: "get-ids",
  ADD_CUSTOMER: "add-customer",
  SAVE_CUSTOMER_IMAGE: "save-customer-image",
  GET_CITIES: "get-cities",
  GET_HAIR_COLORS: "get-hair-colors",
  GET_EYE_COLORS: "get-eye-colors",
  GET_ID_TYPES: "get-id-types",
} as const;

// expose to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  searchCustomer: (firstName: string, lastName: string) => {
    return ipcRenderer.invoke(CHANNELS.SEARCH_CUSTOMER, firstName, lastName);
  },

  getIDs: (customerID: number) => {
    return ipcRenderer.invoke(CHANNELS.GET_IDS, customerID);
  },

  addCustomer: (payload: { customer: any; ids: any[] }) => {
    return ipcRenderer.invoke(CHANNELS.ADD_CUSTOMER, payload);
  },

  saveCustomerImage: (fileName: string, base64: string) => {
    return ipcRenderer.invoke(CHANNELS.SAVE_CUSTOMER_IMAGE, fileName, base64);
  },

  getCities: () => {
    return ipcRenderer.invoke(CHANNELS.GET_CITIES);
  },

  getHairColors: () => {
    return ipcRenderer.invoke(CHANNELS.GET_HAIR_COLORS);
  },

  getEyeColors: () => {
    return ipcRenderer.invoke(CHANNELS.GET_EYE_COLORS);
  },

  getIdTypes: () => {
    return ipcRenderer.invoke(CHANNELS.GET_ID_TYPES);
  },
});
