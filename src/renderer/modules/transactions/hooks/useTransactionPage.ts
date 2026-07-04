import { useEffect, useRef, useState } from "react";
import type { Item } from "../../../../shared/types/Item";
import type { Ticket } from "../../../../shared/types/Ticket";
import {
  itemService,
  type ItemCategoryOption,
} from "../../items/item.api";
import { ticketService } from "../../tickets/ticket.api";
import { windowService } from "../../../shared/api/window.api";
import { filterVisibleTickets, sortTickets } from "../transaction.helpers";
import type { TransactionItemLoadRequest, UseTransactionPageParams } from "../transaction.types";
import { createTransactionItemActions } from "../actions/transactionItemActions";
import { createTransactionTicketActions } from "../actions/transactionTicketActions";

export type { TransactionItemLoadRequest } from "../transaction.types";

export const useTransactionPage = ({
  clientNumber,
  focusTicketNumber,
  focusRequestId,
  refreshKey = 0,
  incomingTicket,
  incomingItemLoadRequest,
  onSelectedTicketChange,
  onClientSoldTicket,
}: UseTransactionPageParams) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string>("");
  const [itemsError, setItemsError] = useState<string>("");
  const [openTicketPawnDialog, setOpenTicketPawnDialog] = useState(false);
  const [openTicketSellDialog, setOpenTicketSellDialog] = useState(false);
  const [openTicketEditDialog, setOpenTicketEditDialog] = useState(false);
  const [openTicketConvertDialog, setOpenTicketConvertDialog] = useState(false);
  const [openTicketTransferDialog, setOpenTicketTransferDialog] =
    useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [itemDialogMode, setItemDialogMode] = useState<"add" | "edit">("add");
  const [removeItemTarget, setRemoveItemTarget] = useState<Item | null>(null);
  const [itemCategories, setItemCategories] = useState<ItemCategoryOption[]>(
    [],
  );
  const [pendingLoadRequest, setPendingLoadRequest] =
    useState<TransactionItemLoadRequest | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const lastItemLoadRequestIdRef = useRef<number | null>(null);
  const loading = ticketsLoading || itemsLoading;
  const displayedItems = selectedTicket?.ticket_number ? items : [];
  const ticketActions = createTransactionTicketActions({
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
  });
  const itemActions = createTransactionItemActions({
    items,
    selectedTicket,
    removeItemTarget,
    pendingLoadRequest,
    setItems,
    setSelectedItem,
    setOpenItemDialog,
    setItemDialogMode,
    setRemoveItemTarget,
    setPendingLoadRequest,
    setStatusMessage,
  });

  useEffect(() => {
    let active = true;

    const fetchTickets = async () => {
      if (!clientNumber) {
        setTickets([]);
        setItems([]);
        setSelectedTicket(null);
        setSelectedItem(null);
        setTicketsError("");
        setItemsError("");
        setStatusMessage("");
        return;
      }

      setTicketsLoading(true);
      setTicketsError("");
      setStatusMessage("");

      try {
        const fetchedTickets = await ticketService.loadTickets(clientNumber);
        const visibleTickets = filterVisibleTickets(fetchedTickets);
        if (!active) {
          return;
        }

        setTickets(visibleTickets);
        setSelectedTicket((prev) => {
          if (!visibleTickets.length) {
            return null;
          }

          if (!prev) {
            return visibleTickets[visibleTickets.length - 1];
          }

          return (
            visibleTickets.find(
              (ticket) => ticket.ticket_number === prev.ticket_number,
            ) ?? visibleTickets[visibleTickets.length - 1]
          );
        });
      } finally {
        if (!active) {
          return;
        }

        setTicketsLoading(false);
      }
    };

    void fetchTickets();

    return () => {
      active = false;
    };
  }, [clientNumber, refreshKey]);

  useEffect(() => {
    if (!focusRequestId || !focusTicketNumber) {
      return;
    }

    const matchedTicket =
      tickets.find((ticket) => ticket.ticket_number === focusTicketNumber) ??
      null;

    if (matchedTicket) {
      setSelectedTicket(matchedTicket);
      setStatusMessage("");
    }
  }, [focusRequestId, focusTicketNumber, tickets]);

  useEffect(() => {
    if (!incomingTicket?.ticket_number) {
      return;
    }

    setTickets((prev) => {
      const nextTickets = prev.some(
        (ticket) => ticket.ticket_number === incomingTicket.ticket_number,
      )
        ? prev.map((ticket) =>
            ticket.ticket_number === incomingTicket.ticket_number
              ? incomingTicket
              : ticket,
          )
        : sortTickets([...prev, incomingTicket]);

      return nextTickets;
    });
  }, [incomingTicket]);

  useEffect(() => {
    if (!incomingItemLoadRequest) {
      return;
    }

    if (
      lastItemLoadRequestIdRef.current === incomingItemLoadRequest.requestId
    ) {
      return;
    }

    lastItemLoadRequestIdRef.current = incomingItemLoadRequest.requestId;
    setPendingLoadRequest(incomingItemLoadRequest);
    setStatusMessage("");

    const openItemLoadWindow = async (request: TransactionItemLoadRequest) => {
      try {
        const selectedItems = await windowService.openItemLoadWindow({
          title:
            request.mode === "repawn"
              ? `Repawn Ticket #${request.sourceTicketNumber} Items`
              : `Load Ticket #${request.sourceTicketNumber} Items`,
          description: `Select the items from ticket #${request.sourceTicketNumber} (${request.sourceTicketDescription}) and add them to ticket #${request.targetTicketNumber}.`,
          actionLabel: "Add to Ticket",
          items: request.items,
        });

        if (!selectedItems?.length) {
          setPendingLoadRequest((prev) =>
            prev?.requestId === request.requestId ? null : prev,
          );
          return;
        }

        await itemActions.handleConfirmLoadedItems(selectedItems, request);
      } catch (err) {
        console.error(err);
        setStatusMessage("Unable to open item load window.");
        setPendingLoadRequest((prev) =>
          prev?.requestId === request.requestId ? null : prev,
        );
      }
    };

    void openItemLoadWindow(incomingItemLoadRequest);
  }, [incomingItemLoadRequest]);

  useEffect(() => {
    let active = true;

    itemService
      .preloadCategories()
      .then((categories) => {
        if (active) {
          setItemCategories(categories);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchItems = async () => {
      if (!selectedTicket?.ticket_number) {
        setItems([]);
        setSelectedItem(null);
        setItemsError("");
        return;
      }

      setItemsLoading(true);
      setItemsError("");

      try {
        const fetchedItems = await itemService.loadItems(
          selectedTicket.ticket_number,
        );
        if (!active) {
          return;
        }

        setItems(fetchedItems);
        setSelectedItem((prev) => {
          if (!fetchedItems.length) {
            return null;
          }

          if (!prev) {
            return fetchedItems[0];
          }

          return (
            fetchedItems.find(
              (item) => item.item_number === prev.item_number,
            ) ?? fetchedItems[0]
          );
        });
      } finally {
        if (!active) {
          return;
        }

        setItemsLoading(false);
      }
    };

    void fetchItems();

    return () => {
      active = false;
    };
  }, [selectedTicket?.ticket_number]);

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    const matchedTicket =
      tickets.find(
        (ticket) => ticket.ticket_number === selectedTicket.ticket_number,
      ) ?? null;

    if (!matchedTicket) {
      setSelectedTicket(tickets[0] ?? null);
    }
  }, [tickets, selectedTicket]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const matchedItem =
      displayedItems.find(
        (item) =>
          (item.draft_id ?? item.item_number) ===
          (selectedItem.draft_id ?? selectedItem.item_number),
      ) ?? null;

    if (!matchedItem) {
      setSelectedItem(displayedItems[0] ?? null);
    }
  }, [displayedItems, selectedItem]);

  useEffect(() => {
    onSelectedTicketChange?.(selectedTicket);
  }, [onSelectedTicketChange, selectedTicket]);

  const handleTicketSelected = (ticket: Ticket | null) => {
    setSelectedTicket(ticket);
    setStatusMessage("");
  };

  const handlePawnButtonClick = () => {
    setOpenTicketPawnDialog(true);
    setStatusMessage("");
  };

  const handleEditButtonClick = () => {
    setOpenTicketEditDialog(true);
    setStatusMessage("");
  };

  const handleSellButtonClick = () => {
    setOpenTicketSellDialog(true);
    setStatusMessage("");
  };

  const handleConvertTicket = () => {
    if (!selectedTicket) {
      return;
    }

    setOpenTicketConvertDialog(true);
    setStatusMessage("");
  };

  const handleTransferTicket = () => {
    if (!clientNumber) {
      return;
    }

    setOpenTicketTransferDialog(true);
    setStatusMessage("");
  };

  return {
    state: {
      tickets,
      items: displayedItems,
      selectedTicket,
      selectedItem,
      loading,
      itemsLoading,
      ticketsError,
      itemsError,
      statusMessage,
      openTicketPawnDialog,
      openTicketSellDialog,
      openTicketEditDialog,
      openTicketConvertDialog,
      openTicketTransferDialog,
      openItemDialog,
      itemDialogMode,
      removeItemTarget,
      itemCategories,
    },
    actions: {
      setOpenTicketPawnDialog,
      setOpenTicketSellDialog,
      setOpenTicketEditDialog,
      setOpenTicketConvertDialog,
      setOpenTicketTransferDialog,
      setOpenItemDialog,
      setRemoveItemTarget,
      handleTicketSelected,
      handlePawnButtonClick,
      handleEditButtonClick,
      handleSellButtonClick,
      handleTicketPrint: ticketActions.handleTicketPrint,
      handleConvertTicket,
      handleTransferTicket,
      handlePawnTicket: ticketActions.handlePawnTicket,
      handleSellTicket: ticketActions.handleSellTicket,
      handleEditTicket: ticketActions.handleEditTicket,
      handleLoadTransferTicketPreview:
        ticketActions.handleLoadTransferTicketPreview,
      handleConvertTicketConfirmed: ticketActions.handleConvertTicketConfirmed,
      handleTransferTicketConfirmed:
        ticketActions.handleTransferTicketConfirmed,
      handleItemClick: itemActions.handleItemClick,
      handleAddItem: itemActions.handleAddItem,
      handleEditItem: itemActions.handleEditItem,
      handleRemoveItem: itemActions.handleRemoveItem,
      handleItemSaved: itemActions.handleItemSaved,
      handleConfirmRemoveItem: itemActions.handleConfirmRemoveItem,
    },
  };
};
