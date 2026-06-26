import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { Ticket } from "../../../../shared/types/Ticket";

export type PaymentMode = "pickup" | "extension";
export type PaymentStatusSeverity = "info" | "success" | "warning";

export type PaymentTicketRow = {
  id: number | string;
  ticketNumber: number;
  status: Ticket["status"];
  location: string;
  description: string;
  dueDate: Date;
  sourceDueDate: Date;
  pickupAmount?: number;
  baseExtensionAmount: number;
  extensionAmount: number;
  extensionMonths: number;
  isPickupAllowed: boolean;
  earliestPickupDate: Date;
};

export type PaymentRowsByMode = Record<PaymentMode, PaymentTicketRow[]>;
export type PaymentSelectionByMode = Record<PaymentMode, GridRowSelectionModel>;

export type PaymentCompletedEvent = {
  type: "payment-completed";
  clientNumber: number;
  pickedUpCount: number;
};
