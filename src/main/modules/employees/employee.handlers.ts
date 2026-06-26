import type { IpcMainInvokeEvent } from "electron";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../../../shared/types/employeeApiTypes.ts";
import { employeeService } from "./employee.service.ts";
import { CHANNELS } from "../../ipc/channels.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerEmployeeHandlers = () => {
  ipcMain.handle(
    CHANNELS.ADD_EMPLOYEE,
    async (_event: IpcMainInvokeEvent, payload: SaveEmployeeInput) => {
      return employeeService.createEmployee(payload);
    },
  );

  ipcMain.handle(
    CHANNELS.SEARCH_EMPLOYEES,
    async (_event: IpcMainInvokeEvent, payload: EmployeeSearchInput) => {
      return employeeService.searchEmployees(payload);
    },
  );

  ipcMain.handle(
    CHANNELS.UPDATE_EMPLOYEE,
    async (
      _event: IpcMainInvokeEvent,
      employeeNumber: number,
      payload: SaveEmployeeInput,
    ) => {
      return employeeService.updateEmployee(employeeNumber, payload);
    },
  );
};
