import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { registerIpcHandlers } from "./ipc/handlers.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // Open DevTools
  // win.webContents.openDevTools();

  // dev: load vite server
  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers(); // register all ipc handlers
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
