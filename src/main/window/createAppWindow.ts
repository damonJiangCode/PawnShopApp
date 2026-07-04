import path from "path";
import type { Event as ElectronEvent } from "electron";

const { BrowserWindow } =
  require("electron/main") as typeof import("electron");

const preloadPath = path.resolve(process.cwd(), "src/preload/index.cjs");

type CreateAppWindowInput = {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  title?: string;
  showMenu?: boolean;
  url: string;
  failLogLabel?: string;
};

export const createAppWindow = ({
  width,
  height,
  minWidth,
  minHeight,
  title,
  showMenu = true,
  url,
  failLogLabel = "window",
}: CreateAppWindowInput): Electron.BrowserWindow => {
  const window = new BrowserWindow({
    width,
    height,
    minWidth,
    minHeight,
    center: true,
    show: false,
    title,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  if (!showMenu) {
    window.setMenu(null);
  }

  window.once("ready-to-show", () => {
    window.show();
    window.focus();
  });

  window.webContents.on(
    "did-fail-load",
    (
      _event: ElectronEvent,
      errorCode: number,
      errorDescription: string,
      validatedURL: string,
    ) => {
      console.error(`[main] failed to load ${failLogLabel}`, {
        errorCode,
        errorDescription,
        validatedURL,
      });
    },
  );

  window.webContents.on("did-finish-load", () => {
    window.show();
  });

  void window.loadURL(url);

  return window;
};
