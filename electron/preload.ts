const { contextBridge, ipcRenderer } = require("electron");

// define all available ipc channels
const CHANNELS = {
  SEARCH_CUSTOMER: "search-customer",
  ADD_CUSTOMER: "add-customer",
  SAVE_CUSTOMER_IMAGE: "save-customer-image",
  GET_CITIES: "get-cities",
} as const;

// expose to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  searchCustomer: (firstName: string, lastName: string) => {
    return ipcRenderer.invoke(CHANNELS.SEARCH_CUSTOMER, firstName, lastName);
  },

  addCustomer: (customer: any, ids: any[]) => {
    return ipcRenderer.invoke(CHANNELS.ADD_CUSTOMER, customer, ids);
  },

  saveCustomerImage: (fileName: string, base64: string) => {
    return ipcRenderer.invoke(CHANNELS.SAVE_CUSTOMER_IMAGE, fileName, base64);
  },

  getCities: () => {
    return ipcRenderer.invoke(CHANNELS.GET_CITIES);
  },
});
