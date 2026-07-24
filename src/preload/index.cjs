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
  LOAD_INTEREST_REPORT: "load-interest-report",
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
  OPEN_TICKET_SEARCH_WINDOW: "open-ticket-search-window",
  OPEN_ITEM_SEARCH_WINDOW: "open-item-search-window",
  OPEN_ITEM_LOAD_WINDOW: "open-item-load-window",
  GET_ITEM_LOAD_WINDOW_PAYLOAD: "get-item-load-window-payload",
  ITEM_LOAD_WINDOW_PAYLOAD_UPDATED: "item-load-window-payload-updated",
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
  searchClients: (firstName, lastName) =>
    invoke(CHANNELS.SEARCH_CLIENTS, firstName, lastName),
  searchClientsByDob: (dateOfBirth) =>
    invoke(CHANNELS.SEARCH_CLIENTS_BY_DOB, dateOfBirth),
  loadCities: () => invoke(CHANNELS.GET_CITIES),
  loadHairColors: () => invoke(CHANNELS.GET_HAIR_COLORS),
  loadHairColorsForAdmin: () => invoke(CHANNELS.GET_ADMIN_HAIR_COLORS),
  loadEyeColors: () => invoke(CHANNELS.GET_EYE_COLORS),
  loadEyeColorsForAdmin: () => invoke(CHANNELS.GET_ADMIN_EYE_COLORS),
  addHairColor: (color) => invoke(CHANNELS.ADD_HAIR_COLOR, color),
  activateHairColor: (color) => invoke(CHANNELS.ACTIVATE_HAIR_COLOR, color),
  deactivateHairColor: (color) => invoke(CHANNELS.DEACTIVATE_HAIR_COLOR, color),
  addEyeColor: (color) => invoke(CHANNELS.ADD_EYE_COLOR, color),
  activateEyeColor: (color) => invoke(CHANNELS.ACTIVATE_EYE_COLOR, color),
  deactivateEyeColor: (color) => invoke(CHANNELS.DEACTIVATE_EYE_COLOR, color),
  loadIdTypes: () => invoke(CHANNELS.GET_ID_TYPES),
  createClient: (payload) => invoke(CHANNELS.ADD_CLIENT, payload),
  updateClient: (payload) => invoke(CHANNELS.UPDATE_CLIENT, payload),
  deleteClient: (clientNumber) => invoke(CHANNELS.DELETE_CLIENT, clientNumber),
  saveClientImage: (fileName, base64) =>
    invoke(CHANNELS.SAVE_CLIENT_IMAGE, fileName, base64),
  loadClientImage: (imagePath) => invoke(CHANNELS.GET_CLIENT_IMAGE, imagePath),
};

const ticketApi = {
  loadTicketsByClient: (clientNumber) =>
    invoke(CHANNELS.GET_TICKETS, clientNumber),
  loadHolidayDates: () => invoke(CHANNELS.GET_HOLIDAY_DATES),
  addHolidayDate: (input) => invoke(CHANNELS.ADD_HOLIDAY_DATE, input),
  deleteHolidayDate: (holidayDate) =>
    invoke(CHANNELS.DELETE_HOLIDAY_DATE, holidayDate),
  loadLocations: () => invoke(CHANNELS.GET_LOCATIONS),
  loadLocationsForAdmin: () => invoke(CHANNELS.GET_ADMIN_LOCATIONS),
  addLocation: (input) => invoke(CHANNELS.ADD_LOCATION, input),
  deactivateLocation: (location) =>
    invoke(CHANNELS.DEACTIVATE_LOCATION, location),
  searchTicketByNumber: (ticketNumber) =>
    invoke(CHANNELS.SEARCH_TICKET, ticketNumber),
  searchPaymentTicketByNumber: (ticketNumber) =>
    invoke(CHANNELS.SEARCH_PAYMENT_TICKET, ticketNumber),
  loadBuybackReport: (input) => invoke(CHANNELS.LOAD_BUYBACK_REPORT, input),
  loadInterestReport: (input) => invoke(CHANNELS.LOAD_INTEREST_REPORT, input),
  createPawnTicket: (payload) => invoke(CHANNELS.ADD_PAWN_TICKET, payload),
  createSellTicket: (payload) => invoke(CHANNELS.ADD_SELL_TICKET, payload),
  updateTicket: (payload) => invoke(CHANNELS.UPDATE_TICKET, payload),
  convertTicket: (payload) => invoke(CHANNELS.CONVERT_TICKET, payload),
  expireTicket: (payload) => invoke(CHANNELS.EXPIRE_TICKET, payload),
  markTicketStolen: (payload) => invoke(CHANNELS.MARK_TICKET_STOLEN, payload),
  pickupTickets: (payload) => invoke(CHANNELS.PICKUP_TICKETS, payload),
  extendTickets: (payload) => invoke(CHANNELS.EXTEND_TICKETS, payload),
  loadTransferTicketPreview: (ticketNumber) =>
    invoke(CHANNELS.GET_TRANSFER_TICKET_PREVIEW, ticketNumber),
  transferTicket: (payload) => invoke(CHANNELS.TRANSFER_TICKET, payload),
};

const employeeApi = {
  createEmployee: (payload) => invoke(CHANNELS.ADD_EMPLOYEE, payload),
  searchEmployees: (payload) => invoke(CHANNELS.SEARCH_EMPLOYEES, payload),
  updateEmployee: (employeeNumber, payload) =>
    invoke(CHANNELS.UPDATE_EMPLOYEE, employeeNumber, payload),
};

const itemApi = {
  loadItemsByTicket: (ticketNumber) => invoke(CHANNELS.GET_ITEMS, ticketNumber),
  loadItemCategories: () => invoke(CHANNELS.GET_ITEM_CATEGORIES),
  searchItems: (payload) => invoke(CHANNELS.SEARCH_ITEMS, payload),
  createItem: (payload) => invoke(CHANNELS.ADD_ITEM, payload),
  updateItem: (payload) => invoke(CHANNELS.UPDATE_ITEM, payload),
  deleteItem: (ticketNumber, itemNumber) =>
    invoke(CHANNELS.DELETE_ITEM, ticketNumber, itemNumber),
  linkItemsToTicket: (ticketNumber, itemNumbers) =>
    invoke(CHANNELS.LINK_ITEMS_TO_TICKET, ticketNumber, itemNumbers),
  saveItemImage: (fileName, base64) =>
    invoke(CHANNELS.SAVE_ITEM_IMAGE, fileName, base64),
  loadItemImage: (imagePath) => invoke(CHANNELS.GET_ITEM_IMAGE, imagePath),
};

const windowApi = {
  openPaymentWindow: (payload) => invoke(CHANNELS.OPEN_PAYMENT_WINDOW, payload),
  openTicketSearchWindow: () => invoke(CHANNELS.OPEN_TICKET_SEARCH_WINDOW),
  openItemSearchWindow: () => invoke(CHANNELS.OPEN_ITEM_SEARCH_WINDOW),
  openItemLoadWindow: (payload) =>
    invoke(CHANNELS.OPEN_ITEM_LOAD_WINDOW, payload),
  loadItemLoadWindowData: (requestId) =>
    invoke(CHANNELS.GET_ITEM_LOAD_WINDOW_PAYLOAD, requestId),
  subscribeToItemLoadWindowDataUpdated: (callback) => {
    const listener = (_event, requestId) => callback(requestId);
    ipcRenderer.on(CHANNELS.ITEM_LOAD_WINDOW_PAYLOAD_UPDATED, listener);
    return () =>
      ipcRenderer.removeListener(
        CHANNELS.ITEM_LOAD_WINDOW_PAYLOAD_UPDATED,
        listener,
      );
  },
  submitItemLoadWindow: (requestId, selectedItemIds) =>
    invoke(CHANNELS.SUBMIT_ITEM_LOAD_WINDOW, requestId, selectedItemIds),
  cancelItemLoadWindow: (requestId) =>
    invoke(CHANNELS.CANCEL_ITEM_LOAD_WINDOW, requestId),
};

contextBridge.exposeInMainWorld("appAPI", {
  client: clientApi,
  employee: employeeApi,
  ticket: ticketApi,
  item: itemApi,
  window: windowApi,
});

console.log("Preload (CJS) loaded");
