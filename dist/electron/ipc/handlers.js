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
    // add customer
    electron_1.ipcMain.handle("add-customer", async (_event, customer, ids) => {
        try {
            console.log("add customer customer", customer);
            console.log("add customer ids", ids);
            const results = await (0, customerCRUD_1.addCustomer)(customer, ids);
            console.log("add customer results", results);
            return results;
        }
        catch (error) {
            console.error("Error adding customer:", error);
            throw error;
        }
    });
    // update customer
    electron_1.ipcMain.handle("update-customer", async (_event, id, customerData) => {
        try {
            const results = await (0, customerCRUD_1.updateCustomer)(id, customerData);
            return results;
        }
        catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    });
    // delete customer;
    electron_1.ipcMain.handle("delete-customer", async (_event, id) => {
        try {
            const results = await (0, customerCRUD_1.deleteCustomer)(id);
            return results;
        }
        catch (error) {
            console.error("Error deleting customer:", error);
            throw error;
        }
    });
    // add other ipc handlers here
    // ipcMain.handle("add-customer", ...)
    // ipcMain.handle("update-customer", ...)
    // ipcMain.handle("delete-customer", ...)
};
exports.registerIpcHandlers = registerIpcHandlers;
