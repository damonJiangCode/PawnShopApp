import { ipcMain } from "electron";
import {
  addCustomer,
  searchCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../backend/database/controllers/customerCRUD";

// register all ipc handlers
export const registerIpcHandlers = () => {
  // customer search
  ipcMain.handle("search-customer", async (_event, firstName, lastName) => {
    try {
      const results = await searchCustomer(firstName, lastName);
      // console.log("search customer results", results);
      return results;
    } catch (error) {
      console.error("Error searching customer: (from handlers.ts)", error);
      throw error;
    }
  });

  // add customer
  ipcMain.handle("add-customer", async (_event, customer, ids) => {
    try {
      console.log("add customer customer", customer);
      console.log("add customer ids", ids);
      const results = await addCustomer(customer, ids);
      console.log("add customer results", results);
      return results;
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error;
    }
  });

  // update customer
  ipcMain.handle("update-customer", async (_event, id, customerData) => {
    try {
      const results = await updateCustomer(id, customerData);
      return results;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  });

  // delete customer;
  ipcMain.handle("delete-customer", async (_event, id) => {
    try {
      const results = await deleteCustomer(id);
      return results;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  });

  // add other ipc handlers here
  // ipcMain.handle("add-customer", ...)
  // ipcMain.handle("update-customer", ...)
  // ipcMain.handle("delete-customer", ...)
};
