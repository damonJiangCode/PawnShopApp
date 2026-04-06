import path from "path";
import type { Event as ElectronEvent } from "electron";
import { registerHandlers } from "./handlers/registerHandlers.ts";

const { app, BrowserWindow, screen } = require("electron/main") as typeof import("electron");
const preloadPath = path.resolve(process.cwd(), "src/preload/index.cjs");
let mainWindow: Electron.BrowserWindow | null = null;

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
      preload: preloadPath,
    },
  });

  win.once("ready-to-show", () => {
    win.show();
    win.focus();
  });

  win.on("closed", () => {
    if (mainWindow === win) {
      mainWindow = null;
    }
  });

  win.webContents.on(
    "did-fail-load",
    (
      _event: ElectronEvent,
      errorCode: number,
      errorDescription: string,
      validatedURL: string,
    ) => {
      console.error("[main] failed to load window", {
        errorCode,
        errorDescription,
        validatedURL,
      });
    },
  );

  win.webContents.on("did-finish-load", () => {
    win.show();
  });

  // Open DevTools
  // win.webContents.openDevTools();

  // dev: load vite server
  win.loadURL("http://localhost:5173");

  mainWindow = win;
  return win;
}

app.whenReady().then(() => {
  createWindow();
  registerHandlers();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

process.on("uncaughtException", (error) => {
  console.error("[main] uncaught exception", error);
});

process.on("unhandledRejection", (error) => {
  console.error("[main] unhandled rejection", error);
});
