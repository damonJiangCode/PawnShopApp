import { useEffect, useRef, useState } from "react";
import type { Item } from "../../../../shared/models/item.model";
import type { Ticket } from "../../../../shared/models/ticket.model";
import { itemApi, type ItemCategoryOption } from "../../items/item.api";
import {
  ticketApi,
  type CreatePawnTicketInput,
} from "../../tickets/ticket.api";
import type { PrintClient } from "../../tickets/ticketPrintTemplate";

interface UseHistoryPageParams {
  clientNumber?: number;
  printClient?: PrintClient;
  focusTicketNumber?: number;
  focusRequestId?: number;
  refreshKey?: number;
  activationKey?: number;
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
  "pawned_expired",
  "pawned_picked_up",
  "sold_expired",
]);

const sortHistoryTickets = (tickets: Ticket[]) =>
  [...tickets].sort((a, b) => {
    const aTime = a.transaction_datetime.getTime();
    const bTime = b.transaction_datetime.getTime();

    if (aTime !== bTime) {
      return aTime - bTime;
    }

    return (a.ticket_number ?? 0) - (b.ticket_number ?? 0);
  });

export const useHistoryPage = ({
  clientNumber,
  printClient,
  focusTicketNumber,
  focusRequestId,
  refreshKey = 0,
  activationKey = 0,
  onRepawnCreated,
  onLoadItemsToTransaction,
}: UseHistoryPageParams) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [ticketScrollRequestKey, setTicketScrollRequestKey] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [openRepawnDialog, setOpenRepawnDialog] = useState(false);
  const [openItemEditDialog, setOpenItemEditDialog] = useState(false);
  const [itemCategories, setItemCategories] = useState<ItemCategoryOption[]>(
    [],
  );
  const selectedTicketRef = useRef<Ticket | null>(null);
  const handledActivationKeyRef = useRef(0);

  useEffect(() => {
    selectedTicketRef.current = selectedTicket;
  }, [selectedTicket]);

  useEffect(() => {
    let active = true;

    itemApi
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
      const fetchedTickets = await ticketApi.loadTickets(clientNumber);
      const historyTickets = sortHistoryTickets(
        fetchedTickets.filter((ticket) =>
          historyTicketStatuses.has(ticket.status),
        ),
      );

      if (!active) return;

      setTickets(historyTickets);
      const nextSelected = historyTickets.length
        ? (historyTickets.find(
            (ticket) =>
              ticket.ticket_number === selectedTicketRef.current?.ticket_number,
          ) ?? historyTickets[historyTickets.length - 1])
        : null;
      setSelectedTicket(nextSelected);
      setTicketScrollRequestKey((prev) => prev + 1);
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
      setTicketScrollRequestKey((prev) => prev + 1);
      setStatusMessage("");
    }
  }, [focusRequestId, focusTicketNumber, tickets]);

  useEffect(() => {
    if (
      !activationKey ||
      handledActivationKeyRef.current === activationKey ||
      !tickets.length
    ) {
      return;
    }

    handledActivationKeyRef.current = activationKey;
    setSelectedTicket(tickets[tickets.length - 1]);
    setTicketScrollRequestKey((prev) => prev + 1);
    setStatusMessage("");
  }, [activationKey, tickets]);

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      if (!selectedTicket?.ticket_number) {
        setItems([]);
        setSelectedItem(null);
        return;
      }

      setItemsLoading(true);
      const fetchedItems = await itemApi.loadItems(
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

    const newTicket = await ticketApi.createPawnTicket({
      ...ticketData,
      client_number: clientNumber,
    });

    setOpenRepawnDialog(false);
    ticketApi.printEnvelopeTicket(newTicket, printClient);
    setStatusMessage(`Ticket #${newTicket.ticket_number} repawned.`);
    onRepawnCreated?.(newTicket, selectedTicket, items);
  };

  const handleLoad = () => {
    if (!selectedTicket) return;
    setStatusMessage("");

    if (!items.length) {
      setStatusMessage("This ticket does not have any items to load.");
      return;
    }

    onLoadItemsToTransaction?.(selectedTicket, items);
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

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setOpenItemEditDialog(true);
    setStatusMessage("");
  };

  return {
    state: {
      tickets,
      selectedTicket,
      items,
      selectedItem,
      ticketsLoading,
      itemsLoading,
      ticketScrollRequestKey,
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
