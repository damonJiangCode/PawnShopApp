import type { Client } from "../models/client.model.ts";
import type { Ticket } from "../models/ticket.model.ts";

type TicketDescriptionInput = {
  description: string;
  location: string;
  amount: number;
};

type EmployeeAuthorizedInput = {
  employee_password: string;
};

export type CreatePawnTicketInput = TicketDescriptionInput &
  EmployeeAuthorizedInput & {
    onetime_fee: number;
    client_number: number;
  };

export type CreateSellTicketInput = TicketDescriptionInput &
  EmployeeAuthorizedInput & {
    client_number: number;
  };

export type UpdateTicketInput = TicketDescriptionInput &
  EmployeeAuthorizedInput & {
    ticket_number: number;
    is_lost: boolean;
    onetime_fee: number;
    partial_payment: number;
  };

export type TransferTicketPreview = {
  ticket_number: number;
  status: Ticket["status"];
  description: string;
  location: string;
  amount: number;
  previous_client_number: number;
  previous_client_name: string;
};

export type TicketSearchResult = {
  ticket: Ticket;
  client: Client;
};

export type ReportDateInput = {
  date: string;
};

export type ReportDateRangeInput = {
  from_date: string;
  to_date: string;
};

export type DailyReportItem = {
  item_number: number;
  quantity: number;
  description: string;
  brand_name: string;
  model_number: string;
  serial_number: string;
  amount: number;
};

export type DailyReportTicket = {
  ticket_number: number;
  amount: number;
  description: string;
  client_name: string;
  date_of_birth?: string;
  gender: string;
  hair_color: string;
  eye_color: string;
  height_cm?: number;
  weight_kg?: number;
  identifications: string;
  items: DailyReportItem[];
};

export type DailyReportResult = ReportDateRangeInput & {
  tickets: DailyReportTicket[];
  missing_item_ticket_numbers: number[];
  total_tickets: number;
  total_items: number;
  total_amount: number;
};

export type BuybackReportRow = {
  ticket_number: number;
  pickup_datetime: Date;
  pickup_amount_paid: number;
  description: string;
  client_name: string;
};

export type BuybackReportResult = {
  date: string;
  rows: BuybackReportRow[];
  total_buyback_price: number;
};

export type InterestReportRow = {
  ticket_number: number;
  months_paid: number;
  amount_paid: number;
  description: string;
  client_name: string;
  payment_datetime: Date;
};

export type InterestReportResult = {
  date: string;
  rows: InterestReportRow[];
  total_interest_paid: number;
};

export type TransferTicketInput = {
  ticket_number: number;
  client_number: number;
};

export type ReverseTicketInput = {
  ticket_number: number;
};

export type ReverseTicketFormField = "ticket_number";

export type ReverseTicketResult = {
  ticket: Ticket;
  client: Client;
  previous_status: "pawned_expired" | "pawned_picked_up";
};

export type ConvertTicketInput = TicketDescriptionInput &
  EmployeeAuthorizedInput & {
    ticket_number: number;
    target_status: "pawned" | "sold";
    onetime_fee: number;
  };

export type ExpireTicketInput = {
  ticket_number: number;
  employee_password?: string;
};

export type MarkTicketStolenInput = EmployeeAuthorizedInput & {
  ticket_number: number;
};

export type PickupTicketPaymentInput = {
  ticket_number: number;
  pickup_amount_paid: number;
};

export type PickupTicketsInput = {
  tickets: PickupTicketPaymentInput[];
};

export type ExtensionTicketPaymentInput = {
  ticket_number: number;
  months: number;
};

export type ExtendTicketsInput = {
  extensions: ExtensionTicketPaymentInput[];
};

export type SaveHolidayInput = {
  holiday_date: string;
  name: string;
};

export type SaveLocationInput = {
  location: string;
  description: string;
};
