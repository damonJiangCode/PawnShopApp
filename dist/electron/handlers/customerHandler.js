"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCustomerHandlers = setupCustomerHandlers;
const electron_1 = require("electron");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "pawnshop",
    password: "your_password",
    port: 5432,
});
function setupCustomerHandlers() {
    electron_1.ipcMain.handle("customer:search", async (_, query) => {
        try {
            const result = await pool.query("SELECT * FROM customers WHERE name ILIKE $1 OR phone ILIKE $1", [`%${query}%`]);
            return result.rows;
        }
        catch (error) {
            console.error("Error searching customers:", error);
            throw error;
        }
    });
    electron_1.ipcMain.handle("customer:add", async (_, customer) => {
        try {
            const result = await pool.query(`INSERT INTO customers (
          name, phone, address, date_of_birth, height, weight, picture_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [
                customer.name,
                customer.phone,
                customer.address,
                customer.date_of_birth,
                customer.height,
                customer.weight,
                customer.picture_url,
            ]);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error adding customer:", error);
            throw error;
        }
    });
    electron_1.ipcMain.handle("customer:update", async (_, customer) => {
        try {
            const result = await pool.query(`UPDATE customers SET 
          name = $1, phone = $2, address = $3, date_of_birth = $4,
          height = $5, weight = $6, picture_url = $7
        WHERE id = $8 RETURNING *`, [
                customer.name,
                customer.phone,
                customer.address,
                customer.date_of_birth,
                customer.height,
                customer.weight,
                customer.picture_url,
                customer.id,
            ]);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    });
    electron_1.ipcMain.handle("customer:delete", async (_, id) => {
        try {
            await pool.query("DELETE FROM customers WHERE id = $1", [id]);
            return true;
        }
        catch (error) {
            console.error("Error deleting customer:", error);
            throw error;
        }
    });
}
