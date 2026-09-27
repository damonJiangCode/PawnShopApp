import type {
  XmlReportConnectionResult,
  XmlReportFormField,
  XmlReportPreviewResult,
  XmlReportSubmitInput,
  XmlReportSubmissionResult,
} from "../payload-contracts/xmlReport.contract.ts";
import type { ReportDateRangeInput } from "../payload-contracts/ticket.contract.ts";

export type XmlReportQueryResult<T> =
  | { ok: true; result: T }
  | { ok: false; field: XmlReportFormField; message: string };

export type XmlReportApi = {
  checkConnection: () => Promise<XmlReportConnectionResult>;
  loadPreview: (
    input: ReportDateRangeInput,
  ) => Promise<XmlReportQueryResult<XmlReportPreviewResult>>;
  submitReport: (
    input: XmlReportSubmitInput,
  ) => Promise<XmlReportQueryResult<XmlReportSubmissionResult>>;
};
