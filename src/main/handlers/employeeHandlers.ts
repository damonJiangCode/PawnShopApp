import type { IpcMainInvokeEvent } from "electron";
import type { SaveEmployeeInput } from "../../shared/types/employeePayload.ts";
import { employeeService } from "../services/employeeService.ts";
import { CHANNELS } from "./channels.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerEmployeeHandlers = () => {
  ipcMain.handle(
    CHANNELS.ADD_EMPLOYEE,
    async (_event: IpcMainInvokeEvent, payload: SaveEmployeeInput) => {
      return employeeService.createEmployee(payload);
    },
  );
};
