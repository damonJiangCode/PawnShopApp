import type { Dispatch, SetStateAction } from "react";
import type { Item } from "../../../../shared/types/Item";
import type { Ticket } from "../../../../shared/types/Ticket";
import {
  type ConvertTicketInput,
  ticketService,
  type CreatePawnTicketInput,
  type CreateSellTicketInput,
  type TransferTicketPreview,
  type UpdateTicketInput,
} from "../../tickets/ticket.api";
import { ticketPrintService } from "../../tickets/ticket-print.service";
import { itemService } from "../../items/item.api";
import { filterVisibleTickets, sortTickets } from "../transaction.helpers";

type TransactionTicketActionDeps = {
  clientNumber?: number;
  selectedTicket: Ticket | null;
  setTickets: Dispatch<SetStateAction<Ticket[]>>;
  setItems: Dispatch<SetStateAction<Item[]>>;
  setSelectedTicket: Dispatch<SetStateAction<Ticket | null>>;
  setSelectedItem: Dispatch<SetStateAction<Item | null>>;
  setOpenTicketPawnDialog: Dispatch<SetStateAction<boolean>>;
  setOpenTicketSellDialog: Dispatch<SetStateAction<boolean>>;
  setOpenTicketEditDialog: Dispatch<SetStateAction<boolean>>;
  setOpenTicketConvertDialog: Dispatch<SetStateAction<boolean>>;
  setOpenTicketTransferDialog: Dispatch<SetStateAction<boolean>>;
  setStatusMessage: Dispatch<SetStateAction<string>>;
  onClientSoldTicket?: () => void;
};

export const createTransactionTicketActions = ({
  clientNumber,
  selectedTicket,
  setTickets,
  setItems,
  setSelectedTicket,
  setSelectedItem,
  setOpenTicketPawnDialog,
  setOpenTicketSellDialog,
  setOpenTicketEditDialog,
  setOpenTicketConvertDialog,
  setOpenTicketTransferDialog,
  setStatusMessage,
  onClientSoldTicket,
}: TransactionTicketActionDeps) => {
  const handleTicketPrint = () => {
    if (!selectedTicket) {
      return;
    }

    ticketPrintService.printEnvelopeTicket(selectedTicket);
    setStatusMessage(
      `Print placeholder ready for ticket #${selectedTicket.ticket_number}.`,
    );
  };

  const handlePawnTicket = async (
    ticketData: Omit<CreatePawnTicketInput, "client_number">,
  ): Promise<void> => {
    if (!clientNumber) {
      throw new Error("Please select a client first.");
    }

    const newTicket = await ticketService.createPawnTicket({
      ...ticketData,
      client_number: clientNumber,
    });

    setTickets((prev) => sortTickets([...prev, newTicket]));
    setSelectedTicket(newTicket);
    setItems([]);
    setSelectedItem(null);
    setOpenTicketPawnDialog(false);
    ticketPrintService.printEnvelopeTicket(newTicket);
    setStatusMessage(`Ticket #${newTicket.ticket_number} pawned.`);
  };

  const handleSellTicket = async (
    ticketData: Omit<CreateSellTicketInput, "client_number">,
  ): Promise<void> => {
    if (!clientNumber) {
      throw new Error("Please select a client first.");
    }

    const newTicket = await ticketService.createSellTicket({
      ...ticketData,
      client_number: clientNumber,
    });

    setTickets((prev) => sortTickets([...prev, newTicket]));
    setSelectedTicket(newTicket);
    setItems([]);
    setSelectedItem(null);
    setOpenTicketSellDialog(false);
    onClientSoldTicket?.();
    ticketPrintService.printEnvelopeTicket(newTicket);
    setStatusMessage(`Ticket #${newTicket.ticket_number} sold.`);
  };

  const handleEditTicket = async (data: UpdateTicketInput): Promise<void> => {
    if (!selectedTicket) {
      throw new Error("Please select a ticket first.");
    }

    const updatedTicket = await ticketService.updateTicket(data);

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_number === selectedTicket.ticket_number
          ? updatedTicket
          : ticket,
      ),
    );
    setSelectedTicket(updatedTicket);
    setOpenTicketEditDialog(false);
    setStatusMessage(`Ticket #${updatedTicket.ticket_number} updated.`);
  };

  const handleLoadTransferTicketPreview = async (
    ticketNumber: number,
  ): Promise<TransferTicketPreview | null> => {
    return ticketService.loadTransferTicketPreview(ticketNumber);
  };

  const handleConvertTicketConfirmed = async (
    data: ConvertTicketInput,
  ): Promise<void> => {
    if (!selectedTicket) {
      throw new Error("Please select a ticket first.");
    }

    const convertedTicket = await ticketService.convertTicket(data);
    const fromStatus = selectedTicket.status;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_number === convertedTicket.ticket_number
          ? convertedTicket
          : ticket,
      ),
    );
    setSelectedTicket(convertedTicket);
    const refreshedItems = convertedTicket.ticket_number
      ? await itemService.loadItems(convertedTicket.ticket_number)
      : [];
    setItems(refreshedItems);
    setSelectedItem((prev) => {
      if (!refreshedItems.length) {
        return null;
      }

      return (
        refreshedItems.find((item) => item.item_number === prev?.item_number) ??
        refreshedItems[0]
      );
    });
    setOpenTicketConvertDialog(false);
    setStatusMessage(
      `Ticket #${convertedTicket.ticket_number} converted from ${fromStatus} to ${convertedTicket.status}.`,
    );
  };

  const handleTransferTicketConfirmed = async (
    ticketNumber: number,
  ): Promise<void> => {
    if (!clientNumber) {
      throw new Error("Please select a client first.");
    }

    const transferredTicket = await ticketService.transferTicket({
      ticket_number: ticketNumber,
      client_number: clientNumber,
    });
    const refreshedTickets = filterVisibleTickets(
      await ticketService.loadTickets(clientNumber),
    );

    setTickets(refreshedTickets);
    setSelectedTicket(
      refreshedTickets.find(
        (ticket) => ticket.ticket_number === transferredTicket.ticket_number,
      ) ?? transferredTicket,
    );
    setItems([]);
    setSelectedItem(null);
    setOpenTicketTransferDialog(false);
    setStatusMessage(`Ticket #${transferredTicket.ticket_number} transferred.`);
  };

  return {
    handleTicketPrint,
    handlePawnTicket,
    handleSellTicket,
    handleEditTicket,
    handleLoadTransferTicketPreview,
    handleConvertTicketConfirmed,
    handleTransferTicketConfirmed,
  };
};
