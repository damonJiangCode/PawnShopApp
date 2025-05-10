"use strict";
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { registerIpcHandlers } = require("./ipc/handlers");
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
            devTools: true, // Enable DevTools
        },
    });
    // Open DevTools
    win.webContents.openDevTools();
    win.loadURL("http://localhost:5173"); // load the frontend
}
app.whenReady().then(() => {
    createWindow();
    registerIpcHandlers(); //   register all ipc handlers
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});
