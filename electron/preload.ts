const { contextBridge, ipcRenderer } = require("electron");

// console.log("Preload script is running"); // Debug log

// define all available ipc channels
const CHANNELS = {
  SEARCH_CUSTOMER: "search-customer",
  ADD_CUSTOMER: "add-customer",
  UPDATE_CUSTOMER: "update-customer",
  DELETE_CUSTOMER: "delete-customer",
} as const;

// expose to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // customer related
  searchCustomer: (firstName: string, lastName: string) => {
    // console.log("searchCustomer called with:", firstName, lastName); // Debug log
    return ipcRenderer.invoke(CHANNELS.SEARCH_CUSTOMER, firstName, lastName);
  },

  // add other api
  // addCustomer: (customerData) => ipcRenderer.invoke(CHANNELS.ADD_CUSTOMER, customerData),
  // updateCustomer: (id, customerData) => ipcRenderer.invoke(CHANNELS.UPDATE_CUSTOMER, id, customerData),
  // deleteCustomer: (id) => ipcRenderer.invoke(CHANNELS.DELETE_CUSTOMER, id),
});

// console.log("Preload script finished"); // Debug log
