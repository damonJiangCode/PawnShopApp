"use strict";
const { contextBridge, ipcRenderer } = require("electron");
// console.log("Preload script is running"); // Debug log
// define all available ipc channels
const CHANNELS = {
    SEARCH_CUSTOMER: "search-customer",
    ADD_CUSTOMER: "add-customer",
    UPDATE_CUSTOMER: "update-customer",
    DELETE_CUSTOMER: "delete-customer",
};
// expose to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
    searchCustomer: (firstName, lastName) => {
        // console.log("searchCustomer called with:", firstName, lastName); // Debug log
        return ipcRenderer.invoke(CHANNELS.SEARCH_CUSTOMER, firstName, lastName);
    },
    addCustomer: (customer, ids) => {
        return ipcRenderer.invoke(CHANNELS.ADD_CUSTOMER, customer, ids);
    },
    updateCustomer: (id, customerData) => {
        return ipcRenderer.invoke(CHANNELS.UPDATE_CUSTOMER, id, customerData);
    },
    deleteCustomer: (id) => {
        return ipcRenderer.invoke(CHANNELS.DELETE_CUSTOMER, id);
    },
});
// console.log("Preload script finished"); // Debug log
