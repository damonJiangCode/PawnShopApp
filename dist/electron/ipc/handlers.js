"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIpcHandlers = void 0;
const electron_1 = require("electron");
const customerCRUD_1 = require("../../backend/database/controllers/customerCRUD");
// register all ipc handlers
const registerIpcHandlers = () => {
    // customer search
    electron_1.ipcMain.handle("search-customer", async (_event, firstName, lastName) => {
        try {
            const results = await (0, customerCRUD_1.searchCustomer)(firstName, lastName);
            // console.log("search customer results", results);
            return results;
        }
        catch (error) {
            console.error("Error searching customer: (from handlers.ts)", error);
            throw error;
        }
    });
    // add other ipc handlers here
    // ipcMain.handle("add-customer", ...)
    // ipcMain.handle("update-customer", ...)
    // ipcMain.handle("delete-customer", ...)
};
exports.registerIpcHandlers = registerIpcHandlers;
