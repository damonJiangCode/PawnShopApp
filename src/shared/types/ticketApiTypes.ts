import type { Ticket } from "./Ticket.ts";
import type { Client } from "./Client.ts";

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

export type ConvertTicketInput = TicketDescriptionInput &
  EmployeeAuthorizedInput & {
    ticket_number: number;
    target_status: "pawned" | "sell";
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
