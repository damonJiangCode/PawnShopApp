import type { Ticket } from "../../../shared/types/Ticket";

export const ticketPrintService = {
  printEnvelopeTicket: (ticket: Ticket) => {
    // TODO: Replace this placeholder with the hand-written envelope ticket format.
    // Keep Transaction Prnt, Pawn, and Sell routed through this one function.
    console.info("[ticketPrintService] printEnvelopeTicket placeholder", {
      ticketNumber: ticket.ticket_number,
      status: ticket.status,
    });
  },
};
