import { ipcMain } from "electron";
import {
  searchCustomer,
  getIds,
  addCustomer,
  getCities,
  getHairColors,
  getEyeColors,
  getIdTypes,
  getTickets,
  getItems,
} from "../../backend/database/controllers/customerCRUD";
import fs from "fs";
import path from "path";

// register all ipc handlers
export const registerIpcHandlers = () => {
  // customer search
  ipcMain.handle("search-customer", async (_event, firstName, lastName) => {
    try {
      const results = await searchCustomer(firstName, lastName);
      // console.log("[handlers.ts] LOG, ", results);
      return results;
    } catch (error) {
      console.error("[handlers.ts] ERROR searching customer, ", error);
      throw error;
    }
  });

  // get customer's IDs
  ipcMain.handle("get-ids", async (_event, customerID) => {
    try {
      const results = await getIds(customerID);
      // console.log("[handlers.ts] LOG, ", results);
      return results;
    } catch (error) {
      console.error("[handlers.ts] ERROR getting customer IDs, ", error);
      throw error;
    }
  });

  // add customer
  ipcMain.handle("add-customer", async (_event, payload) => {
    try {
      const { customer, identifications } = payload;
      const result = await addCustomer(customer, identifications);
      // console.log("[handlers.ts] LOG, ", result);
      return result;
    } catch (error) {
      console.error("[handlers.ts] ERROR adding customer, ", error);
      throw error;
    }
  });

  // save customer image
  ipcMain.handle(
    "save-customer-image",
    async (_event, fileName: string, base64: string) => {
      try {
        const base64Data = base64.replace(/^data:image\/png;base64,/, "");

        const relPath = path.join("customer_images", fileName);
        const absPath = path.resolve(relPath);

        if (!fs.existsSync(path.dirname(absPath))) {
          fs.mkdirSync(path.dirname(absPath), { recursive: true });
        }

        fs.writeFileSync(absPath, base64Data, "base64");

        // console.log("save-customer-image results (handler.ts) abs:", absPath);
        // console.log("save-customer-image results (handler.ts) rel:", relPath);
        // console.log(
        //   "save-customer-image results (handler.ts) fileName:",
        //   fileName
        // );
        // console.log("save-customer-image results (handler.ts) base64:", base64);

        return relPath;
      } catch (err) {
        console.error("[handlers.ts] ERROR saving customer image, ", err);
        return null;
      }
    }
  );

  // get customer image
  ipcMain.handle("get-customer-image", async (_event, images_path: string) => {
    try {
      if (!images_path) {
        console.warn("get-customer-image: no images_path provided");
        return null;
      }
      const absPath = path.resolve(images_path);
      if (!fs.existsSync(absPath)) {
        console.warn("get-customer-image: file not found:", absPath);
        return null;
      }
      const base64 = fs.readFileSync(absPath, { encoding: "base64" });
      return base64;
    } catch (err) {
      console.error("[handlers.ts] ERROR getting customer image, ", err);
      return null;
    }
  });

  // get cities
  ipcMain.handle("get-cities", async () => {
    try {
      const result = await getCities();
      const provinces = result.provinces;
      const citiesByProvince = result.citiesByProvince;
      // console.log("[handlers.ts] LOG provinces, ", provinces);
      // console.log("[handlers.ts] LOG citiesByProvince, ", citiesByProvince);
      return { provinces, citiesByProvince };
    } catch (error) {
      console.error("[handlers.ts] ERROR getting cities, ", error);
      throw error;
    }
  });

  // get hair colors
  ipcMain.handle("get-hair-colors", async () => {
    try {
      const hairColors = await getHairColors();
      // console.log("[handlers.ts] LOG, ", hairColors);
      return hairColors;
    } catch (error) {
      console.error("[handlers.ts] ERROR getting hair colors, ", error);
      throw error;
    }
  });

  // get eye colors
  ipcMain.handle("get-eye-colors", async () => {
    try {
      const eyeColors = await getEyeColors();
      // console.log("[handlers.ts] LOG, ", eyeColors);
      return eyeColors;
    } catch (error) {
      console.error("[handlers.ts] ERROR getting eye colors, ", error);
      throw error;
    }
  });

  // get id types
  ipcMain.handle("get-id-types", async () => {
    try {
      const idTypes = await getIdTypes();
      // console.log("[handlers.ts] LOG, ", idTypes);
      return idTypes;
    } catch (error) {
      console.error("[handlers.ts] ERROR getting ID types, ", error);
      throw error;
    }
  });

  // get tickets
  ipcMain.handle("get-tickets", async (_event, customerNumber: number) => {
    try {
      const tickets = await getTickets(customerNumber);
      // console.log("[handlers.ts] LOG, ", tickets);
      return tickets;
    } catch (error) {
      console.error("[handlers.ts] ERROR getting tickets, ", error);
      throw error;
    }
  });

  // get items
  ipcMain.handle("get-items", async (_event, ticketNumber: number) => {
    try {
      const items = await getItems(ticketNumber);
      console.log("[handlers.ts] LOG: ", items);
      return items;
    } catch (error) {
      console.error("[handlers.ts] ERROR getting items, ", error);
      throw error;
    }
  });
};
