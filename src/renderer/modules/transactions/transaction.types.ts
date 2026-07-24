import type { Item } from "../../../shared/models/item.model";
import type { Ticket } from "../../../shared/models/ticket.model";

export interface TransactionItemLoadRequest {
  requestId: number;
  targetTicketNumber: number;
  sourceTicketNumber: number;
  sourceTicketDescription: string;
  items: Item[];
  mode: "repawn" | "load";
}

export interface UseTransactionPageParams {
  clientNumber?: number;
  focusTicketNumber?: number;
  focusRequestId?: number;
  refreshKey?: number;
  incomingTicket?: Ticket | null;
  incomingItemLoadRequest?: TransactionItemLoadRequest | null;
  onSelectedTicketChange?: (ticket: Ticket | null) => void;
  onClientSoldTicket?: () => void;
}
