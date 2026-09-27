import type { IpcMainInvokeEvent } from "electron";
import type { ReportDateRangeInput } from "../../../shared/payload-contracts/ticket.contract.ts";
import type {
  XmlReportFormField,
  XmlReportSubmitInput,
} from "../../../shared/payload-contracts/xmlReport.contract.ts";
import type { XmlReportQueryResult } from "../../../shared/api-contracts/xmlReportApi.contract.ts";
import { CHANNELS } from "../../ipc/channels.ts";
import { xmlReportService } from "./xml-report.service.ts";
import { extractFieldError } from "../../shared/createFieldError.ts";

const { ipcMain } = require("electron/main") as typeof import("electron");

const runXmlReportQuery = async <T>(
  operation: () => Promise<T>,
): Promise<XmlReportQueryResult<T>> => {
  try {
    return { ok: true, result: await operation() };
  } catch (error) {
    const fieldError = extractFieldError(error);

    if (fieldError) {
      return {
        ok: false,
        field: fieldError.field as XmlReportFormField,
        message: fieldError.message,
      };
    }

    throw error;
  }
};

export const registerXmlReportHandlers = () => {
  ipcMain.handle(CHANNELS.CHECK_XML_REPORT_CONNECTION, () =>
    xmlReportService.checkConnection(),
  );

  ipcMain.handle(
    CHANNELS.LOAD_XML_REPORT_PREVIEW,
    (_event: IpcMainInvokeEvent, input: ReportDateRangeInput) =>
      runXmlReportQuery(() => xmlReportService.loadPreview(input)),
  );

  ipcMain.handle(
    CHANNELS.SUBMIT_XML_REPORT,
    (_event: IpcMainInvokeEvent, input: XmlReportSubmitInput) =>
      runXmlReportQuery(() => xmlReportService.submitReport(input)),
  );
};
