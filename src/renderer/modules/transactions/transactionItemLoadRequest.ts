import type { Item } from "../../../shared/models/item.model";

export interface TransactionItemLoadRequest {
  requestId: number;
  targetTicketNumber: number;
  sourceTicketNumber: number;
  sourceTicketDescription: string;
  items: Item[];
  mode: "repawn" | "load";
}
