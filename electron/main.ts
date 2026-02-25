import { app, BrowserWindow, screen } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { registerIpcHandlers } from "./ipc/handlers.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const { workAreaSize } = screen.getPrimaryDisplay();
  const targetWidth = Math.round(workAreaSize.width * 0.72);
  const targetHeight = Math.round(workAreaSize.height * 0.8);

  const width = Math.max(1100, Math.min(targetWidth, 1500));
  const height = Math.max(760, Math.min(targetHeight, 980));

  const win = new BrowserWindow({
    width,
    height,
    minWidth: 1000,
    minHeight: 700,
    center: true,
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
