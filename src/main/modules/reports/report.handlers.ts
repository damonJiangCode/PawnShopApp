import type { IpcMainInvokeEvent } from "electron";
import type { ReportDateInput } from "../../../shared/types/ticketApiTypes.ts";
import { CHANNELS } from "../../ipc/channels.ts";
import { reportService } from "./report.service.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

export const registerReportHandlers = () => {
  ipcMain.handle(
    CHANNELS.LOAD_BUYBACK_REPORT,
    async (_event: IpcMainInvokeEvent, input: ReportDateInput) => {
      return reportService.loadBuybackReport(input);
    },
  );

  ipcMain.handle(
    CHANNELS.LOAD_INTEREST_REPORT,
    async (_event: IpcMainInvokeEvent, input: ReportDateInput) => {
      return reportService.loadInterestReport(input);
    },
  );
};
