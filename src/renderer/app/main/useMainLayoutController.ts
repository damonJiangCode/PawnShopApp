import { useEffect, useState } from "react";
import type { Client } from "../../../shared/types/Client";
import type { Item } from "../../../shared/types/Item";
import type { Ticket } from "../../../shared/types/Ticket";
import type { TransactionItemLoadRequest } from "../../pages/TransactionPage";
import { windowService } from "../../services/windowService";

type SearchParams = {
  firstName: string;
  lastName: string;
};

type ItemLoadMode = "repawn" | "load";

type TicketSearchSelectedEvent = {
  type: "ticket-search-selected";
  ticket: Ticket;
  client: Client;
  targetTab: "transaction" | "history";
};

type TicketExpiredEvent = {
  type: "ticket-expired";
  ticket: Ticket;
  client: Client;
};

type TicketStolenEvent = {
  type: "ticket-stolen";
  ticket: Ticket;
  client: Client;
};

type PaymentCompletedEvent = {
  type: "payment-completed";
  clientNumber: number;
  pickedUpCount?: number;
};

const isTicketSearchSelectedEvent = (
  value: unknown,
): value is TicketSearchSelectedEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as { type?: string }).type === "ticket-search-selected";
};

const isTicketExpiredEvent = (value: unknown): value is TicketExpiredEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as { type?: string }).type === "ticket-expired";
};

const isTicketStolenEvent = (value: unknown): value is TicketStolenEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as { type?: string }).type === "ticket-stolen";
};

const isPaymentCompletedEvent = (
  value: unknown,
): value is PaymentCompletedEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as { type?: string }).type === "payment-completed";
};

export const useMainLayoutController = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchRequestKey, setSearchRequestKey] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [forcedClient, setForcedClient] = useState<Client | null>(null);
  const [selectedTransactionTicket, setSelectedTransactionTicket] =
    useState<Ticket | null>(null);
  const [incomingTransactionTicket, setIncomingTransactionTicket] =
    useState<Ticket | null>(null);
  const [incomingItemLoadRequest, setIncomingItemLoadRequest] =
    useState<TransactionItemLoadRequest | null>(null);
  const [focusTicketNumber, setFocusTicketNumber] = useState<
    number | undefined
  >();
  const [focusRequestId, setFocusRequestId] = useState(0);
  const [itemLoadRequestId, setItemLoadRequestId] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);

  const updateCurrentClient = (
    clientNumber: number | undefined,
    updater: (client: Client) => Client,
  ) => {
    if (!clientNumber) {
      return;
    }

    const updateMatchingClient = (client: Client | null) =>
      client?.client_number === clientNumber ? updater(client) : client;

    setSelectedClient(updateMatchingClient);
    setForcedClient(updateMatchingClient);
  };

  useEffect(() => {
    const channel = new BroadcastChannel("payment-events");

    channel.onmessage = (event: MessageEvent) => {
      if (!isPaymentCompletedEvent(event.data)) {
        return;
      }

      setTransactionRefreshKey((prev) => prev + 1);
      setHistoryRefreshKey((prev) => prev + 1);
      if (event.data.pickedUpCount) {
        updateCurrentClient(event.data.clientNumber, (client) => ({
          ...client,
          redeem_count:
            Number(client.redeem_count ?? 0) + (event.data.pickedUpCount ?? 0),
          updated_at: new Date(),
        }));
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel("menu-events");

    channel.onmessage = (event: MessageEvent) => {
      if (isTicketExpiredEvent(event.data) || isTicketStolenEvent(event.data)) {
        setTransactionRefreshKey((prev) => prev + 1);
        setHistoryRefreshKey((prev) => prev + 1);

        if (isTicketExpiredEvent(event.data)) {
          updateCurrentClient(event.data.client.client_number, (client) => ({
            ...client,
            expire_count: Number(client.expire_count ?? 0) + 1,
            updated_at: new Date(),
          }));
        }

        return;
      }

      if (!isTicketSearchSelectedEvent(event.data)) {
        return;
      }

      const { client, targetTab, ticket } = event.data;

      setSelectedClient(client);
      setForcedClient(client);
      setCurrentTab(targetTab === "history" ? 2 : 1);
      setFocusTicketNumber(ticket.ticket_number);
      setFocusRequestId((prev) => prev + 1);

      if (targetTab === "history") {
        setHistoryRefreshKey((prev) => prev + 1);
      } else {
        setTransactionRefreshKey((prev) => prev + 1);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  const handleSearch = ({ firstName, lastName }: SearchParams) => {
    setForcedClient(null);
    setSearchFirstName(firstName);
    setSearchLastName(lastName);
    setSearchRequestKey((prev) => prev + 1);
  };

  const handleClear = () => {
    setForcedClient(null);
    setSearchFirstName("");
    setSearchLastName("");
    setSearchRequestKey((prev) => prev + 1);
    setSelectedClient(null);
    setSelectedTransactionTicket(null);
    setIncomingTransactionTicket(null);
    setIncomingItemLoadRequest(null);
    setFocusTicketNumber(undefined);
    setHistoryRefreshKey((prev) => prev + 1);
  };

  const requestHistoryRefresh = () => {
    setHistoryRefreshKey((prev) => prev + 1);
  };

  const handlePayment = () => {
    void windowService.openPaymentWindow({
      clientNumber: selectedClient?.client_number,
      clientLastName: selectedClient?.last_name,
      clientFirstName: selectedClient?.first_name,
    });
  };

  const handleClientSoldTicket = () => {
    updateCurrentClient(selectedClient?.client_number, (client) => ({
      ...client,
      sold_count: Number(client.sold_count ?? 0) + 1,
      updated_at: new Date(),
    }));
  };

  const sendItemsToTransaction = (
    targetTicket: Ticket,
    sourceTicket: Ticket,
    sourceItems: Item[],
    mode: ItemLoadMode,
  ) => {
    if (!targetTicket.ticket_number || !sourceTicket.ticket_number) {
      return;
    }

    const nextRequestId = itemLoadRequestId + 1;
    setItemLoadRequestId(nextRequestId);
    setIncomingItemLoadRequest({
      requestId: nextRequestId,
      targetTicketNumber: targetTicket.ticket_number,
      sourceTicketNumber: sourceTicket.ticket_number,
      sourceTicketDescription: sourceTicket.description,
      items: sourceItems,
      mode,
    });
  };

  const handleRepawnCreated = (
    ticket: Ticket,
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => {
    setIncomingTransactionTicket(ticket);
    setFocusTicketNumber(ticket.ticket_number);
    setFocusRequestId((prev) => prev + 1);
    setCurrentTab(1);
    sendItemsToTransaction(ticket, sourceTicket, sourceItems, "repawn");
  };

  const handleLoadHistoryItems = (
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => {
    if (!selectedTransactionTicket) {
      setCurrentTab(1);
      return;
    }

    setCurrentTab(1);
    sendItemsToTransaction(
      selectedTransactionTicket,
      sourceTicket,
      sourceItems,
      "load",
    );
  };

  return {
    state: {
      currentTab,
      searchFirstName,
      searchLastName,
      searchRequestKey,
      selectedClient,
      forcedClient,
      selectedTransactionTicket,
      incomingTransactionTicket,
      incomingItemLoadRequest,
      focusTicketNumber,
      focusRequestId,
      historyRefreshKey,
      transactionRefreshKey,
    },
    actions: {
      setCurrentTab,
      setSelectedClient,
      setSelectedTransactionTicket,
      handleSearch,
      handleClear,
      handlePayment,
      handleClientSoldTicket,
      requestHistoryRefresh,
      handleRepawnCreated,
      handleLoadHistoryItems,
    },
  };
};
