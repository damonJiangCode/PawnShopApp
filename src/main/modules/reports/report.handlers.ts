import type { IpcMainInvokeEvent } from "electron";
import type {
  OverdueReportInput,
  ReportFormField,
  ReportDateRangeInput,
} from "../../../shared/payload-contracts/ticket.contract.ts";
import { CHANNELS } from "../../ipc/channels.ts";
import { reportService } from "./report.service.ts";
import type { ReportQueryResult } from "../../../shared/api-contracts/ticketApi.contract.ts";
import { extractFieldError } from "../../shared/createFieldError.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

const runReportQuery = async <T>(
  operation: () => Promise<T>,
): Promise<ReportQueryResult<T>> => {
  try {
    return { ok: true, result: await operation() };
  } catch (error) {
    const fieldError = extractFieldError(error);

    if (fieldError) {
      return {
        ok: false,
        field: fieldError.field as ReportFormField,
        message: fieldError.message,
      };
    }

    throw error;
  }
};

export const registerReportHandlers = () => {
  ipcMain.handle(
    CHANNELS.LOAD_OVERDUE_REPORT,
    async (_event: IpcMainInvokeEvent, input: OverdueReportInput) => {
      return runReportQuery(() => reportService.loadOverdueReport(input));
    },
  );

  ipcMain.handle(
    CHANNELS.LOAD_DAILY_REPORT,
    async (_event: IpcMainInvokeEvent, input: ReportDateRangeInput) => {
      return runReportQuery(() => reportService.loadDailyReport(input));
    },
  );

  ipcMain.handle(
    CHANNELS.LOAD_BUYBACK_REPORT,
    async (_event: IpcMainInvokeEvent, input: ReportDateRangeInput) => {
      return runReportQuery(() => reportService.loadBuybackReport(input));
    },
  );

  ipcMain.handle(
    CHANNELS.LOAD_INTEREST_REPORT,
    async (_event: IpcMainInvokeEvent, input: ReportDateRangeInput) => {
      return runReportQuery(() => reportService.loadInterestReport(input));
    },
  );
};
