import type { ReportDateRangeInput } from "./ticket.contract.ts";

export type XmlReportFormField = "from_date" | "to_date" | "form";

export type XmlReportConnectionResult = {
  environment: "sandbox" | "production";
  connected: boolean;
  error_code: number;
  message: string;
};

export type XmlReportProperty = {
  Name: string;
  Value: string;
};

export type XmlReportImagePayload = {
  imageCategory: "Customer" | "Item";
  imageType: "Jpeg" | "Png" | "Gif";
  imageData: string;
};

export type XmlReportItemPayload = {
  make: string;
  model: string;
  serialNumber: string;
  description: string;
  amount: number;
  itemType: "Other" | "Jewelry" | "Firearm";
  itemStatus: "Pawn" | "Buy";
  images?: { Image: XmlReportImagePayload[] };
  isVoid: false;
  employee: string;
  extraItem: { PropertyValue: XmlReportProperty[] };
};

export type XmlReportTicketPayload = {
  key: {
    ticketType: "Pawn" | "Buy";
    ticketnumber: string;
    ticketDateTime: string;
  };
  redeemByDate: string;
  customer: {
    name: string;
    fname: string;
    lname: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    idType: string;
    idNumber: string;
    idType2?: string;
    idNumber2?: string;
    dob: string;
    weight: number;
    height: number;
    eyeColor: string;
    hairColor: string;
    sex: string;
    images?: { Image: XmlReportImagePayload[] };
    extraCustomer: { PropertyValue: XmlReportProperty[] };
  };
  items: { Item: XmlReportItemPayload[] };
  isVoid: false;
  extraTicket: { PropertyValue: XmlReportProperty[] };
};

export type XmlReportTicketPreview = {
  payload: XmlReportTicketPayload;
  photo_count: number;
  expected_photo_count: number;
  errors: string[];
  warnings: string[];
  submission_status: "pending" | "submitting" | "submitted" | "failed";
  submission_message: string;
};

export type XmlReportPreviewResult = ReportDateRangeInput & {
  preview_token: string;
  tickets: XmlReportTicketPreview[];
  total_tickets: number;
  valid_tickets: number;
  invalid_tickets: number;
};

export type XmlReportSubmitInput = ReportDateRangeInput & {
  preview_token: string;
};

export type XmlReportSubmissionResult = {
  from_date: string;
  to_date: string;
  results: Array<{
    ticket_number: number;
    status: "submitted" | "failed" | "skipped";
    error_code: number;
    message: string;
  }>;
  submitted_tickets: number;
  failed_tickets: number;
  skipped_tickets: number;
};
