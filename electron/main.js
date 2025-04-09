import { app, BrowserWindow, Menu, ipcMain } from "electron";
import menu from "./views/menu.js";
import path from "node:path";
import { fileURLToPath } from "url";
import { handlers } from "./handlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173");

  win.webContents.openDevTools();

  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
