import { useEffect, useRef, useState } from "react";
import type { Item } from "../../../shared/types/Item";
import type { Ticket } from "../../../shared/types/Ticket";
import {
  itemService,
  type ItemCategoryOption,
} from "../../services/itemService";
import {
  ticketService,
  type CreatePawnTicketInput,
} from "../../services/ticketService";
import { windowService } from "../../services/windowService";

interface UseHistoryPageControllerParams {
  clientNumber?: number;
  focusTicketNumber?: number;
  focusRequestId?: number;
  refreshKey?: number;
  transactionTargetTicket?: Ticket | null;
  onRepawnCreated?: (
    ticket: Ticket,
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => void;
  onLoadItemsToTransaction?: (
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => void;
}

const historyTicketStatuses = new Set<Ticket["status"]>([
  "pawn_expired",
  "picked_up",
  "sell_expired",
]);

const getHistoryUpdatedTime = (ticket: Ticket) => {
  const updatedAt = ticket.status_updated_at?.getTime();

  if (Number.isFinite(updatedAt)) {
    return updatedAt;
  }

  return ticket.transaction_datetime.getTime();
};

const sortHistoryTickets = (tickets: Ticket[]) =>
  [...tickets].sort((a, b) => {
    const aTime = getHistoryUpdatedTime(a);
    const bTime = getHistoryUpdatedTime(b);

    if (aTime !== bTime) {
      return aTime - bTime;
    }

    return (a.ticket_number ?? 0) - (b.ticket_number ?? 0);
  });

export const useHistoryPageController = ({
  clientNumber,
  focusTicketNumber,
  focusRequestId,
  refreshKey = 0,
  transactionTargetTicket,
  onRepawnCreated,
  onLoadItemsToTransaction,
}: UseHistoryPageControllerParams) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [openRepawnDialog, setOpenRepawnDialog] = useState(false);
  const [openItemEditDialog, setOpenItemEditDialog] = useState(false);
  const [itemCategories, setItemCategories] = useState<ItemCategoryOption[]>(
    [],
  );
  const transactionTargetTicketRef = useRef<Ticket | null>(
    transactionTargetTicket ?? null,
  );

  useEffect(() => {
    transactionTargetTicketRef.current = transactionTargetTicket ?? null;
  }, [transactionTargetTicket]);

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

    const loadTickets = async () => {
      if (!clientNumber) {
        setTickets([]);
        setSelectedTicket(null);
        setItems([]);
        setSelectedItem(null);
        setStatusMessage("");
        return;
      }

      setTicketsLoading(true);
      const fetchedTickets = await ticketService.loadTickets(clientNumber);
      const historyTickets = sortHistoryTickets(
        fetchedTickets.filter(
          (ticket) =>
            ticket.is_stolen || historyTicketStatuses.has(ticket.status),
        ),
      );

      if (!active) return;

      setTickets(historyTickets);
      setSelectedTicket((prev) => {
        if (!historyTickets.length) return null;
        return (
          historyTickets.find(
            (ticket) => ticket.ticket_number === prev?.ticket_number,
          ) ?? historyTickets[historyTickets.length - 1]
        );
      });
      setTicketsLoading(false);
    };

    void loadTickets();

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
    let active = true;

    const loadItems = async () => {
      if (!selectedTicket?.ticket_number) {
        setItems([]);
        setSelectedItem(null);
        return;
      }

      setItemsLoading(true);
      const fetchedItems = await itemService.loadItems(
        selectedTicket.ticket_number,
      );

      if (!active) return;

      setItems(fetchedItems);
      setSelectedItem((prev) => {
        if (!fetchedItems.length) return null;
        return (
          fetchedItems.find((item) => item.item_number === prev?.item_number) ??
          fetchedItems[0]
        );
      });
      setItemsLoading(false);
    };

    void loadItems();

    return () => {
      active = false;
    };
  }, [selectedTicket?.ticket_number]);

  const handleRepawn = () => {
    if (!selectedTicket) return;
    setOpenRepawnDialog(true);
    setStatusMessage("");
  };

  const handleRepawnSave = async (
    ticketData: Omit<CreatePawnTicketInput, "client_number">,
  ) => {
    if (!clientNumber || !selectedTicket) {
      throw new Error("Please select a client and ticket first.");
    }

    const newTicket = await ticketService.createPawnTicket({
      ...ticketData,
      client_number: clientNumber,
    });

    setOpenRepawnDialog(false);
    setStatusMessage(`Ticket #${newTicket.ticket_number} repawned.`);
    onRepawnCreated?.(newTicket, selectedTicket, items);
  };

  const handleLoad = async () => {
    if (!selectedTicket) return;
    setStatusMessage("");

    try {
      const selectedItems = await windowService.openItemLoadWindow({
        title: `Load Ticket #${selectedTicket.ticket_number} Items`,
        description: `Select items from ticket #${selectedTicket.ticket_number}.`,
        actionLabel: "Add to Ticket",
        items,
      });

      handleConfirmLoad(selectedTicket, selectedItems ?? []);
    } catch (err) {
      console.error(err);
      setStatusMessage("Unable to open item load window.");
    }
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setOpenItemEditDialog(true);
    setStatusMessage("");
  };

  const handleItemSaved = (savedItem: Item) => {
    setItems((prev) =>
      prev.map((item) =>
        item.item_number === savedItem.item_number ? savedItem : item,
      ),
    );
    setSelectedItem(savedItem);
    setOpenItemEditDialog(false);
    setStatusMessage(`Item #${savedItem.item_number} updated.`);
  };

  const handleConfirmLoad = (sourceTicket: Ticket, selectedItems: Item[]) => {
    if (!selectedItems.length) {
      return;
    }

    if (!transactionTargetTicketRef.current?.ticket_number) {
      setStatusMessage(
        "Select or create a transaction ticket before loading items.",
      );
      return;
    }

    onLoadItemsToTransaction?.(sourceTicket, selectedItems);
  };

  return {
    state: {
      tickets,
      selectedTicket,
      items,
      selectedItem,
      ticketsLoading,
      itemsLoading,
      statusMessage,
      openRepawnDialog,
      openItemEditDialog,
      itemCategories,
    },
    actions: {
      setSelectedTicket,
      setSelectedItem,
      setStatusMessage,
      setOpenRepawnDialog,
      setOpenItemEditDialog,
      handleRepawn,
      handleRepawnSave,
      handleLoad,
      handleEditItem,
      handleItemSaved,
    },
  };
};
