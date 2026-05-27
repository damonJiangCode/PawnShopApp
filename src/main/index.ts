import path from "path";
import type { Event as ElectronEvent } from "electron";
import { registerHandlers } from "./handlers/registerHandlers.ts";

const { app, BrowserWindow, Menu, screen } =
  require("electron/main") as typeof import("electron");
const preloadPath = path.resolve(process.cwd(), "src/preload/index.cjs");
let mainWindow: Electron.BrowserWindow | null = null;

app.setName("ME");

type MenuActionConfig = {
  id: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
};

const openMenuActionWindow = ({
  id,
  title,
  description,
  width = 720,
  height = 420,
}: MenuActionConfig) => {
  const childWindow = new BrowserWindow({
    width,
    height,
    minWidth: 560,
    minHeight: 320,
    center: true,
    show: false,
    title,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  childWindow.setMenu(null);

  childWindow.once("ready-to-show", () => {
    childWindow.show();
    childWindow.focus();
  });

  const searchParams = new URLSearchParams({
    window: "menu-action",
    actionId: id,
    title,
    description,
  });

  void childWindow.loadURL(`http://localhost:5173?${searchParams.toString()}`);
};

const createAppMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "Ticket",
      submenu: [
        {
          label: "Search",
          click: () =>
            openMenuActionWindow({
              id: "ticket-search",
              title: "Search Ticket",
              description: "Search tickets by ticket number.",
            }),
        },
        {
          label: "Expire",
          click: () =>
            openMenuActionWindow({
              id: "ticket-expire",
              title: "Expire Ticket",
              description: "Enter a ticket number and expire it.",
              width: 860,
              height: 680,
            }),
        },
        {
          label: "Mark Stolen",
          click: () =>
            openMenuActionWindow({
              id: "ticket-stolen",
              title: "Mark Ticket Stolen",
              description: "Mark a ticket as stolen for police/risk tracking.",
            }),
        },
      ],
    },
    {
      label: "Item",
      submenu: [
        {
          label: "Search",
          click: () =>
            openMenuActionWindow({
              id: "item-search",
              title: "Search Item",
              description:
                "Search by item number, brand name, model number, or serial number.",
              width: 820,
            }),
        },
      ],
    },
    {
      label: "Layaway",
      submenu: [
        {
          label: "Search",
          click: () =>
            openMenuActionWindow({
              id: "layaway-search",
              title: "Search Layaway",
              description: "Search layaway records by customer name.",
            }),
        },
        {
          label: "Add",
          click: () =>
            openMenuActionWindow({
              id: "layaway-add",
              title: "Add Layaway",
              description: "Create a new layaway record.",
            }),
        },
        {
          label: "Edit",
          click: () =>
            openMenuActionWindow({
              id: "layaway-edit",
              title: "Edit Layaway",
              description: "Update layaway item or payment information.",
            }),
        },
        {
          label: "Cancel",
          click: () =>
            openMenuActionWindow({
              id: "layaway-cancel",
              title: "Cancel Layaway",
              description: "Cancel an existing layaway record.",
            }),
        },
      ],
    },
    {
      label: "Report",
      submenu: [
        {
          label: "Daily Report",
          click: () =>
            openMenuActionWindow({
              id: "report-daily",
              title: "Daily Report",
              description: "Generate daily ticket and payment records.",
            }),
        },
        {
          label: "Buyback",
          click: () =>
            openMenuActionWindow({
              id: "report-buyback",
              title: "Buyback Report",
              description: "Generate daily pickup/buyback reconciliation.",
            }),
        },
        {
          label: "Interest",
          click: () =>
            openMenuActionWindow({
              id: "report-interest",
              title: "Interest Report",
              description: "Generate interest payment records.",
            }),
        },
        {
          label: "Police XML",
          click: () =>
            openMenuActionWindow({
              id: "report-police-xml",
              title: "Police XML / BWI",
              description: "Generate the daily police XML file.",
            }),
        },
      ],
    },
    {
      label: "Location",
      submenu: [
        {
          label: "Add",
          click: () =>
            openMenuActionWindow({
              id: "location-add",
              title: "Add Location",
              description: "Add a new pawn location.",
            }),
        },
        {
          label: "Deactivate",
          click: () =>
            openMenuActionWindow({
              id: "location-deactivate",
              title: "Deactivate Location",
              description: "Hide an old location from future tickets.",
            }),
        },
      ],
    },
    {
      label: "Holiday",
      submenu: [
        {
          label: "Add",
          click: () =>
            openMenuActionWindow({
              id: "holiday-add",
              title: "Add Holiday",
              description: "Add a holiday for business-day hold calculations.",
            }),
        },
        {
          label: "Remove",
          click: () =>
            openMenuActionWindow({
              id: "holiday-remove",
              title: "Remove Holiday",
              description: "Remove a holiday from business-day calculations.",
            }),
        },
      ],
    },
    {
      label: "Employee",
      submenu: [
        {
          label: "Add",
          click: () =>
            openMenuActionWindow({
              id: "employee-add",
              title: "Add Employee",
              description: "Create a new employee account.",
            }),
        },
        {
          label: "Edit",
          click: () =>
            openMenuActionWindow({
              id: "employee-edit",
              title: "Edit Employee",
              description: "Update employee information.",
            }),
        },
        {
          label: "Deactivate",
          click: () =>
            openMenuActionWindow({
              id: "employee-deactivate",
              title: "Deactivate Employee",
              description: "Disable an employee without removing history.",
            }),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

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
  createAppMenu();
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
