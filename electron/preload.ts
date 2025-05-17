const { contextBridge, ipcRenderer } = require("electron");

// define all available ipc channels
const CHANNELS = {
  SEARCH_CUSTOMER: "search-customer",
  ADD_CUSTOMER: "add-customer",
  SAVE_CUSTOMER_IMAGE: "save-customer-image",
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

  getLocations: () => {
    return ipcRenderer.invoke("get-locations");
  },
});
