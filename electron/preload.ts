import { Customer, ID } from "../shared/models/Customer";

const { contextBridge, ipcRenderer } = require("electron");

// define all available ipc channels
const CHANNELS = {
  SEARCH_CUSTOMER: "search-customer",
  GET_IDS: "get-ids",
  ADD_CUSTOMER: "add-customer",
  SAVE_CUSTOMER_IMAGE: "save-customer-image",
  GET_CUSTOMER_IMAGE: "get-customer-image",
  GET_CITIES: "get-cities",
  GET_HAIR_COLORS: "get-hair-colors",
  GET_EYE_COLORS: "get-eye-colors",
  GET_ID_TYPES: "get-id-types",
  GET_TICKETS: "get-tickets",
  GET_ITEMS: "get-items",
} as const;

// expose to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  searchCustomer: (firstName: string, lastName: string) => {
    return ipcRenderer.invoke(CHANNELS.SEARCH_CUSTOMER, firstName, lastName);
  },

  getIDs: (customerID: number) => {
    return ipcRenderer.invoke(CHANNELS.GET_IDS, customerID);
  },

  addCustomer: (payload: { customer: Customer; ids: ID[] }) => {
    return ipcRenderer.invoke(CHANNELS.ADD_CUSTOMER, payload);
  },

  saveCustomerImage: (fileName: string, base64: string) => {
    return ipcRenderer.invoke(CHANNELS.SAVE_CUSTOMER_IMAGE, fileName, base64);
  },

  getCustomerImage: (customerNumber: number) => {
    return ipcRenderer.invoke(CHANNELS.GET_CUSTOMER_IMAGE, customerNumber);
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

  getTickets: (customerNumber: number) => {
    return ipcRenderer.invoke(CHANNELS.GET_TICKETS, customerNumber);
  },

  getItems: (ticketNumber: number) => {
    return ipcRenderer.invoke(CHANNELS.GET_ITEMS, ticketNumber);
  },
});
