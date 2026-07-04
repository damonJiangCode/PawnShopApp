import type { Item } from "../../../shared/types/Item";
import type { Ticket } from "../../../shared/types/Ticket";

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
