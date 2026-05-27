import { useEffect, useRef, useState } from "react";
import type { Item } from "../../../shared/types/Item";
import type { Ticket } from "../../../shared/types/Ticket";
import {
  itemService,
  type ItemCategoryOption,
} from "../../services/itemService";
import { ticketPrintService } from "../../services/ticketPrintService";
import { calculation } from "../../../shared/utils/calculation";
import {
  type ConvertTicketInput,
  type ExpireTicketInput,
  ticketService,
  type CreatePawnTicketInput,
  type CreateSellTicketInput,
  type TransferTicketPreview,
  type UpdateTicketInput,
} from "../../services/ticketService";
import { windowService } from "../../services/windowService";

export interface TransactionItemLoadRequest {
  requestId: number;
  targetTicketNumber: number;
  sourceTicketNumber: number;
  sourceTicketDescription: string;
  items: Item[];
  mode: "repawn" | "load";
}

interface UseTransactionPageControllerParams {
  clientNumber?: number;
  focusTicketNumber?: number;
  focusRequestId?: number;
  refreshKey?: number;
  incomingTicket?: Ticket | null;
  incomingItemLoadRequest?: TransactionItemLoadRequest | null;
  onSelectedTicketChange?: (ticket: Ticket | null) => void;
  onHistoryRefreshRequest?: () => void;
  onClientSoldTicket?: () => void;
}

export const useTransactionPageController = ({
  clientNumber,
  focusTicketNumber,
  focusRequestId,
  refreshKey = 0,
  incomingTicket,
  incomingItemLoadRequest,
  onSelectedTicketChange,
  onHistoryRefreshRequest,
  onClientSoldTicket,
}: UseTransactionPageControllerParams) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string>("");
  const [itemsError, setItemsError] = useState<string>("");
  const [openTicketPawnDialog, setopenTicketPawnDialog] = useState(false);
  const [openTicketSellDialog, setopenTicketSellDialog] = useState(false);
  const [openTicketEditDialog, setopenTicketEditDialog] = useState(false);
  const [openTicketConvertDialog, setOpenTicketConvertDialog] = useState(false);
  const [openTicketExpireDialog, setOpenTicketExpireDialog] = useState(false);
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

  const filterVisibleTickets = (nextTickets: Ticket[]) =>
    nextTickets.filter(
      (ticket) => ticket.status === "pawned" || ticket.status === "sold",
    );
  const sortTickets = (nextTickets: Ticket[]) =>
    [...nextTickets].sort((a, b) => {
      const aTime = a.transaction_datetime.getTime();
      const bTime = b.transaction_datetime.getTime();

      if (aTime !== bTime) {
        return aTime - bTime;
      }

      return (a.ticket_number ?? 0) - (b.ticket_number ?? 0);
    });

  const loading = ticketsLoading || itemsLoading;
  const displayedItems = selectedTicket?.ticket_number ? items : [];

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

        await handleConfirmLoadedItems(selectedItems, request);
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
    setopenTicketPawnDialog(true);
    setStatusMessage("");
  };

  const handleEditButtonClick = () => {
    setopenTicketEditDialog(true);
    setStatusMessage("");
  };

  const handleSellButtonClick = () => {
    setopenTicketSellDialog(true);
    setStatusMessage("");
  };

  const handleTicketPrint = () => {
    if (!selectedTicket) {
      return;
    }

    ticketPrintService.printEnvelopeTicket(selectedTicket);
    setStatusMessage(
      `Print placeholder ready for ticket #${selectedTicket.ticket_number}.`,
    );
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

  const handleTicketExpire = () => {
    if (!selectedTicket) {
      return;
    }

    if (
      selectedTicket.status !== "pawned" &&
      selectedTicket.status !== "sold"
    ) {
      setStatusMessage("Only pawned or sold tickets can be expired.");
      return;
    }

    if (
      !selectedTicket.due_date ||
      !calculation.isBeforeCalendarDate(selectedTicket.due_date)
    ) {
      setStatusMessage("Only tickets past the due date can be expired.");
      return;
    }

    setOpenTicketExpireDialog(true);
    setStatusMessage("");
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
    setopenTicketPawnDialog(false);
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
    setopenTicketSellDialog(false);
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
    setopenTicketEditDialog(false);
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

  const handleExpireTicketConfirmed = async (
    data: ExpireTicketInput,
  ): Promise<void> => {
    if (!selectedTicket) {
      throw new Error("Please select a ticket first.");
    }

    const expiredTicket = await ticketService.expireTicket(data);

    setTickets((prev) =>
      prev.filter(
        (ticket) => ticket.ticket_number !== expiredTicket.ticket_number,
      ),
    );
    setSelectedTicket(null);
    setItems([]);
    setSelectedItem(null);
    setOpenTicketExpireDialog(false);
    setStatusMessage(`Ticket #${expiredTicket.ticket_number} expired.`);
    onHistoryRefreshRequest?.();
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

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setStatusMessage("");
  };

  const handleAddItem = () => {
    if (!selectedTicket?.ticket_number) {
      setStatusMessage("Select a ticket first.");
      return;
    }

    setItemDialogMode("add");
    setSelectedItem(null);
    setOpenItemDialog(true);
    setStatusMessage("");
  };

  const handleEditItem = (item: Item) => {
    if (item.is_loaded_draft) {
      setStatusMessage("Loaded draft items must be saved before editing.");
      return;
    }

    setSelectedItem(item);
    setItemDialogMode("edit");
    setOpenItemDialog(true);
    setStatusMessage("");
  };

  const handleRemoveItem = (item: Item) => {
    setRemoveItemTarget(item);
    setStatusMessage("");
  };

  const handleItemSaved = (savedItem: Item) => {
    setItems((prev) => {
      const exists = prev.some(
        (item) => item.item_number === savedItem.item_number,
      );
      return exists
        ? prev.map((item) =>
            item.item_number === savedItem.item_number ? savedItem : item,
          )
        : [savedItem, ...prev];
    });
    setSelectedItem(savedItem);
    setOpenItemDialog(false);
    setStatusMessage(`Item #${savedItem.item_number} saved.`);
  };

  const handleConfirmRemoveItem = async () => {
    if (!removeItemTarget || !selectedTicket?.ticket_number) {
      setRemoveItemTarget(null);
      return;
    }

    await itemService.deleteItem(
      selectedTicket.ticket_number,
      removeItemTarget.item_number,
    );

    const nextItems = items.filter(
      (current) => current.item_number !== removeItemTarget.item_number,
    );

    setItems(nextItems);
    setSelectedItem((prev) => {
      if (
        (prev?.draft_id ?? prev?.item_number) !== removeItemTarget.item_number
      ) {
        return prev ?? null;
      }

      return [...nextItems][0] ?? null;
    });
    setRemoveItemTarget(null);
    setStatusMessage(`Item #${removeItemTarget.item_number} removed.`);
  };

  const handleConfirmLoadedItems = async (
    selectedItems: Item[],
    loadRequest: TransactionItemLoadRequest | null = pendingLoadRequest,
  ) => {
    if (!loadRequest || !selectedItems.length) {
      setPendingLoadRequest((prev) =>
        prev?.requestId === loadRequest?.requestId ? null : prev,
      );
      return;
    }

    try {
      const linkedItems = await itemService.linkItemsToTicket(
        loadRequest.targetTicketNumber,
        selectedItems.map((item) => item.item_number),
      );

      setItems((prev) => {
        const existingItemNumbers = new Set(
          prev.map((item) => item.item_number),
        );
        const newItems = linkedItems.filter(
          (item) => !existingItemNumbers.has(item.item_number),
        );

        return [...newItems, ...prev];
      });
      setSelectedItem((prev) => prev ?? linkedItems[0] ?? null);
      setStatusMessage(
        `${linkedItems.length} item(s) loaded from ticket #${loadRequest.sourceTicketNumber} into ticket #${loadRequest.targetTicketNumber}.`,
      );
    } catch (err) {
      console.error(err);
      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Unable to load the selected item(s).",
      );
    } finally {
      setPendingLoadRequest((prev) =>
        prev?.requestId === loadRequest.requestId ? null : prev,
      );
    }
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
      openTicketExpireDialog,
      openTicketTransferDialog,
      openItemDialog,
      itemDialogMode,
      removeItemTarget,
      itemCategories,
    },
    actions: {
      setopenTicketPawnDialog,
      setopenTicketSellDialog,
      setopenTicketEditDialog,
      setOpenTicketConvertDialog,
      setOpenTicketExpireDialog,
      setOpenTicketTransferDialog,
      setOpenItemDialog,
      setRemoveItemTarget,
      handleTicketSelected,
      handlePawnButtonClick,
      handleEditButtonClick,
      handleSellButtonClick,
      handleTicketPrint,
      handleConvertTicket,
      handleTransferTicket,
      handleTicketExpire,
      handlePawnTicket,
      handleSellTicket,
      handleEditTicket,
      handleLoadTransferTicketPreview,
      handleConvertTicketConfirmed,
      handleExpireTicketConfirmed,
      handleTransferTicketConfirmed,
      handleItemClick,
      handleAddItem,
      handleEditItem,
      handleRemoveItem,
      handleItemSaved,
      handleConfirmRemoveItem,
    },
  };
};
