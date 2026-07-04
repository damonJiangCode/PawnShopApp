import { buildRendererUrl } from "./windowUrl.ts";
import { createAppWindow } from "./createAppWindow.ts";

const { screen } = require("electron/main") as typeof import("electron");

let mainWindow: Electron.BrowserWindow | null = null;

export const openMainWindow = () => {
  const { workAreaSize } = screen.getPrimaryDisplay();
  const targetWidth = Math.round(workAreaSize.width * 0.72);
  const targetHeight = Math.round(workAreaSize.height * 0.8);

  const width = Math.max(1100, Math.min(targetWidth, 1500));
  const height = Math.max(760, Math.min(targetHeight, 980));

  const window = createAppWindow({
    width,
    height,
    minWidth: 1000,
    minHeight: 700,
    url: buildRendererUrl(),
    failLogLabel: "main window",
  });

  window.on("closed", () => {
    if (mainWindow === window) {
      mainWindow = null;
    }
  });

  mainWindow = window;
  return window;
};

export const hasMainWindow = () =>
  Boolean(mainWindow && !mainWindow.isDestroyed());
