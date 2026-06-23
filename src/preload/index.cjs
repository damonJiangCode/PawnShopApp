const { contextBridge, ipcRenderer } = require("electron");

const CHANNELS = {
  SEARCH_CLIENTS: "search-clients",
  SEARCH_CLIENTS_BY_DOB: "search-clients-by-dob",
  GET_CITIES: "get-cities",
  GET_HAIR_COLORS: "get-hair-colors",
  GET_ADMIN_HAIR_COLORS: "get-admin-hair-colors",
  GET_EYE_COLORS: "get-eye-colors",
  GET_ADMIN_EYE_COLORS: "get-admin-eye-colors",
  ADD_HAIR_COLOR: "add-hair-color",
  ACTIVATE_HAIR_COLOR: "activate-hair-color",
  DEACTIVATE_HAIR_COLOR: "deactivate-hair-color",
  ADD_EYE_COLOR: "add-eye-color",
  ACTIVATE_EYE_COLOR: "activate-eye-color",
  DEACTIVATE_EYE_COLOR: "deactivate-eye-color",
  GET_ID_TYPES: "get-id-types",
  GET_LOCATIONS: "get-locations",
  GET_ADMIN_LOCATIONS: "get-admin-locations",
  ADD_LOCATION: "add-location",
  DEACTIVATE_LOCATION: "deactivate-location",
  ADD_CLIENT: "add-client",
  UPDATE_CLIENT: "update-client",
  DELETE_CLIENT: "delete-client",
  ADD_EMPLOYEE: "add-employee",
  SEARCH_EMPLOYEES: "search-employees",
  UPDATE_EMPLOYEE: "update-employee",
  SAVE_CLIENT_IMAGE: "save-client-image",
  GET_CLIENT_IMAGE: "get-client-image",
  GET_TICKETS: "get-tickets",
  GET_HOLIDAY_DATES: "get-holiday-dates",
  ADD_HOLIDAY_DATE: "add-holiday-date",
  DELETE_HOLIDAY_DATE: "delete-holiday-date",
  SEARCH_TICKET: "search-ticket",
  SEARCH_PAYMENT_TICKET: "search-payment-ticket",
  LOAD_BUYBACK_REPORT: "load-buyback-report",
  GET_ITEMS: "get-items",
  GET_ITEM_CATEGORIES: "get-item-categories",
  SEARCH_ITEMS: "search-items",
  ADD_ITEM: "add-item",
  UPDATE_ITEM: "update-item",
  DELETE_ITEM: "delete-item",
  LINK_ITEMS_TO_TICKET: "link-items-to-ticket",
  SAVE_ITEM_IMAGE: "save-item-image",
  GET_ITEM_IMAGE: "get-item-image",
  OPEN_PAYMENT_WINDOW: "open-payment-window",
  OPEN_ITEM_LOAD_WINDOW: "open-item-load-window",
  GET_ITEM_LOAD_WINDOW_PAYLOAD: "get-item-load-window-payload",
  SUBMIT_ITEM_LOAD_WINDOW: "submit-item-load-window",
  CANCEL_ITEM_LOAD_WINDOW: "cancel-item-load-window",
  ADD_PAWN_TICKET: "add-pawn-ticket",
  ADD_SELL_TICKET: "add-sell-ticket",
  UPDATE_TICKET: "update-ticket",
  CONVERT_TICKET: "convert-ticket",
  EXPIRE_TICKET: "expire-ticket",
  MARK_TICKET_STOLEN: "mark-ticket-stolen",
  PICKUP_TICKETS: "pickup-tickets",
  EXTEND_TICKETS: "extend-tickets",
  GET_TRANSFER_TICKET_PREVIEW: "get-transfer-ticket-preview",
  TRANSFER_TICKET: "transfer-ticket",
};

const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args);

const clientApi = {
  search: (firstName, lastName) =>
    invoke(CHANNELS.SEARCH_CLIENTS, firstName, lastName),
  searchByDob: (dateOfBirth) =>
    invoke(CHANNELS.SEARCH_CLIENTS_BY_DOB, dateOfBirth),
  loadCities: () => invoke(CHANNELS.GET_CITIES),
  loadHairColors: () => invoke(CHANNELS.GET_HAIR_COLORS),
  loadAdminHairColors: () => invoke(CHANNELS.GET_ADMIN_HAIR_COLORS),
  loadEyeColors: () => invoke(CHANNELS.GET_EYE_COLORS),
  loadAdminEyeColors: () => invoke(CHANNELS.GET_ADMIN_EYE_COLORS),
  addHairColor: (color) => invoke(CHANNELS.ADD_HAIR_COLOR, color),
  activateHairColor: (color) => invoke(CHANNELS.ACTIVATE_HAIR_COLOR, color),
  deactivateHairColor: (color) => invoke(CHANNELS.DEACTIVATE_HAIR_COLOR, color),
  addEyeColor: (color) => invoke(CHANNELS.ADD_EYE_COLOR, color),
  activateEyeColor: (color) => invoke(CHANNELS.ACTIVATE_EYE_COLOR, color),
  deactivateEyeColor: (color) => invoke(CHANNELS.DEACTIVATE_EYE_COLOR, color),
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
  loadHolidayDates: () => invoke(CHANNELS.GET_HOLIDAY_DATES),
  addHolidayDate: (input) => invoke(CHANNELS.ADD_HOLIDAY_DATE, input),
  deleteHolidayDate: (holidayDate) =>
    invoke(CHANNELS.DELETE_HOLIDAY_DATE, holidayDate),
  loadLocations: () => invoke(CHANNELS.GET_LOCATIONS),
  loadAdminLocations: () => invoke(CHANNELS.GET_ADMIN_LOCATIONS),
  addLocation: (input) => invoke(CHANNELS.ADD_LOCATION, input),
  deactivateLocation: (location) =>
    invoke(CHANNELS.DEACTIVATE_LOCATION, location),
  searchTicket: (ticketNumber) => invoke(CHANNELS.SEARCH_TICKET, ticketNumber),
  searchPaymentTicket: (ticketNumber) =>
    invoke(CHANNELS.SEARCH_PAYMENT_TICKET, ticketNumber),
  loadBuybackReport: (input) => invoke(CHANNELS.LOAD_BUYBACK_REPORT, input),
  createPawn: (payload) => invoke(CHANNELS.ADD_PAWN_TICKET, payload),
  createSell: (payload) => invoke(CHANNELS.ADD_SELL_TICKET, payload),
  update: (payload) => invoke(CHANNELS.UPDATE_TICKET, payload),
  convert: (payload) => invoke(CHANNELS.CONVERT_TICKET, payload),
  expire: (payload) => invoke(CHANNELS.EXPIRE_TICKET, payload),
  markStolen: (payload) => invoke(CHANNELS.MARK_TICKET_STOLEN, payload),
  pickup: (payload) => invoke(CHANNELS.PICKUP_TICKETS, payload),
  extend: (payload) => invoke(CHANNELS.EXTEND_TICKETS, payload),
  loadTransferPreview: (ticketNumber) =>
    invoke(CHANNELS.GET_TRANSFER_TICKET_PREVIEW, ticketNumber),
  transfer: (payload) => invoke(CHANNELS.TRANSFER_TICKET, payload),
};

const employeeApi = {
  create: (payload) => invoke(CHANNELS.ADD_EMPLOYEE, payload),
  search: (payload) => invoke(CHANNELS.SEARCH_EMPLOYEES, payload),
  update: (employeeNumber, payload) =>
    invoke(CHANNELS.UPDATE_EMPLOYEE, employeeNumber, payload),
};

const itemApi = {
  loadByTicket: (ticketNumber) => invoke(CHANNELS.GET_ITEMS, ticketNumber),
  loadCategories: () => invoke(CHANNELS.GET_ITEM_CATEGORIES),
  search: (payload) => invoke(CHANNELS.SEARCH_ITEMS, payload),
  create: (payload) => invoke(CHANNELS.ADD_ITEM, payload),
  update: (payload) => invoke(CHANNELS.UPDATE_ITEM, payload),
  delete: (ticketNumber, itemNumber) =>
    invoke(CHANNELS.DELETE_ITEM, ticketNumber, itemNumber),
  linkToTicket: (ticketNumber, itemNumbers) =>
    invoke(CHANNELS.LINK_ITEMS_TO_TICKET, ticketNumber, itemNumbers),
  saveImage: (fileName, base64) =>
    invoke(CHANNELS.SAVE_ITEM_IMAGE, fileName, base64),
  loadImage: (imagePath) => invoke(CHANNELS.GET_ITEM_IMAGE, imagePath),
};

const windowApi = {
  openPaymentWindow: (payload) => invoke(CHANNELS.OPEN_PAYMENT_WINDOW, payload),
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
  employee: employeeApi,
  ticket: ticketApi,
  item: itemApi,
  window: windowApi,
});

console.log("Preload (CJS) loaded");
