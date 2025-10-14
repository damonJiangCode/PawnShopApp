import { ipcMain } from "electron";
import {
  searchCustomer,
  getIds,
  addCustomer,
  getCities,
  getHairColors,
  getEyeColors,
  getIdTypes,
} from "../../backend/database/controllers/customerCRUD";
import fs from "fs";
import path from "path";

// register all ipc handlers
export const registerIpcHandlers = () => {
  // customer search
  ipcMain.handle("search-customer", async (_event, firstName, lastName) => {
    try {
      const results = await searchCustomer(firstName, lastName);
      // console.log("search-customer results (handler.ts):", results);
      return results;
    } catch (error) {
      console.error("Error searching customer (handler.ts):", error);
      throw error;
    }
  });

  // get customer's IDs
  ipcMain.handle("get-ids", async (_event, customerID) => {
    try {
      const results = await getIds(customerID);
      // console.log("get-ids results (handler.ts):", results);
      return results;
    } catch (error) {
      console.error("Error getting customer IDs (handler.ts):", error);
      throw error;
    }
  });

  // add customer
  ipcMain.handle("add-customer", async (_event, payload) => {
    try {
      const { customer, identifications } = payload;
      const result = await addCustomer(customer, identifications);
      // console.log("add-customer results (handler.ts):", result);
      return result;
    } catch (error) {
      console.error("Error adding customer (handler.ts):", error);
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
        console.error("Error saving customer image (handlers.ts):", err);
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
      console.error("Error getting customer image (handlers.ts):", err);
      return null;
    }
  });

  // get cities
  ipcMain.handle("get-cities", async () => {
    try {
      const result = await getCities();
      const provinces = result.provinces;
      const citiesByProvince = result.citiesByProvince;
      // console.log("provinces:", provinces);
      // console.log("citiesByProvince:", citiesByProvince);
      return { provinces, citiesByProvince };
    } catch (error) {
      console.error("Error getting cities (handler.ts):", error);
      throw error;
    }
  });

  // get hair colors
  ipcMain.handle("get-hair-colors", async () => {
    try {
      const hairColors = await getHairColors();
      // console.log("get-hair-colors results (handler.ts):", hairColors);
      return hairColors;
    } catch (error) {
      console.error("Error getting hair colors (handler.ts):", error);
      throw error;
    }
  });

  // get eye colors
  ipcMain.handle("get-eye-colors", async () => {
    try {
      const eyeColors = await getEyeColors();
      // console.log("get-eye-colors results (handler.ts):", eyeColors);
      return eyeColors;
    } catch (error) {
      console.error("Error getting eye colors (handler.ts):", error);
      throw error;
    }
  });

  // get id types
  ipcMain.handle("get-id-types", async () => {
    try {
      const idTypes = await getIdTypes();
      // console.log("get-id-types results (handler.ts):", idTypes);
      return idTypes;
    } catch (error) {
      console.error("Error getting ID types (handler.ts):", error);
      throw error;
    }
  });
};
