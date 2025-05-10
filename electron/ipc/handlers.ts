import { ipcMain } from "electron";
import { searchCustomer } from "../../backend/database/controllers/customerCRUD";

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

  // add other ipc handlers here
  // ipcMain.handle("add-customer", ...)
  // ipcMain.handle("update-customer", ...)
  // ipcMain.handle("delete-customer", ...)
};
