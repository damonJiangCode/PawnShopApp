import { useEffect, useRef, useState } from "react";
import type { Client } from "../../shared/models/client.model";
import type { Item } from "../../shared/models/item.model";
import type { Ticket } from "../../shared/models/ticket.model";
import { itemApi } from "../modules/items/item.api";
import { getAppApi } from "../shared/api/app.api";

type SearchParams = {
  firstName: string;
  lastName: string;
};

type BirthdaySearchParams = {
  dateOfBirth: string;
};

type ItemSearchPayloadMode = "repawn" | "load";

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

type ItemSearchAddToTicketEvent = {
  type: "item-search-add-to-ticket";
  requestId: string;
  itemNumber?: number;
  itemNumbers?: number[];
};

type ItemSearchTargetStatusRequestEvent = {
  type: "item-search-target-status-request";
  requestId: string;
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

const isItemSearchAddToTicketEvent = (
  value: unknown,
): value is ItemSearchAddToTicketEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as { type?: string }).type === "item-search-add-to-ticket";
};

const isItemSearchTargetStatusRequestEvent = (
  value: unknown,
): value is ItemSearchTargetStatusRequestEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    (value as { type?: string }).type === "item-search-target-status-request"
  );
};

const isPaymentCompletedEvent = (
  value: unknown,
): value is PaymentCompletedEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as { type?: string }).type === "payment-completed";
};

export const useWorkspaceLayout = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchDateOfBirth, setSearchDateOfBirth] = useState("");
  const [searchRequestKey, setSearchRequestKey] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [forcedClient, setForcedClient] = useState<Client | null>(null);
  const [selectedTransactionTicket, setSelectedTransactionTicket] =
    useState<Ticket | null>(null);
  const [incomingTransactionTicket, setIncomingTransactionTicket] =
    useState<Ticket | null>(null);
  const [focusTicketNumber, setFocusTicketNumber] = useState<
    number | undefined
  >();
  const [focusRequestId, setFocusRequestId] = useState(0);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [historyActivationKey, setHistoryActivationKey] = useState(0);
  const [transactionRefreshKey, setTransactionRefreshKey] = useState(0);
  const currentTabRef = useRef(currentTab);
  const selectedTransactionTicketRef = useRef<Ticket | null>(null);

  useEffect(() => {
    currentTabRef.current = currentTab;
  }, [currentTab]);

  useEffect(() => {
    selectedTransactionTicketRef.current = selectedTransactionTicket;
  }, [selectedTransactionTicket]);

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

    const postItemSearchTargetStatus = (requestId?: string) => {
      const targetTicket = selectedTransactionTicketRef.current;

      channel.postMessage({
        type: "item-search-target-status",
        requestId,
        canAddToTicket:
          currentTabRef.current === 1 && Boolean(targetTicket?.ticket_number),
        targetTicketNumber: targetTicket?.ticket_number,
      });
    };

    channel.onmessage = (event: MessageEvent) => {
      if (isItemSearchAddToTicketEvent(event.data)) {
        const { requestId } = event.data;
        const itemNumbers = event.data.itemNumbers?.length
          ? event.data.itemNumbers
          : event.data.itemNumber
            ? [event.data.itemNumber]
            : [];
        const targetTicket = selectedTransactionTicketRef.current;

        if (currentTabRef.current !== 1 || !targetTicket?.ticket_number) {
          channel.postMessage({
            type: "item-search-add-to-ticket-result",
            requestId,
            error: "Select a ticket on the Transaction page first.",
          });
          return;
        }

        if (!itemNumbers.length) {
          channel.postMessage({
            type: "item-search-add-to-ticket-result",
            requestId,
            error: "Select at least one item first.",
          });
          return;
        }

        void itemApi
          .linkItemsToTicket(targetTicket.ticket_number, itemNumbers)
          .then((linkedItems) => {
            setTransactionRefreshKey((prev) => prev + 1);
            channel.postMessage({
              type: "item-search-add-to-ticket-result",
              requestId,
              items: linkedItems,
              message: `${linkedItems.length} item(s) added to ticket #${targetTicket.ticket_number}.`,
            });
          })
          .catch((err) => {
            console.error(err);
            channel.postMessage({
              type: "item-search-add-to-ticket-result",
              requestId,
              error:
                err instanceof Error
                  ? err.message
                  : "Unable to add the selected item to the ticket.",
            });
          });
        return;
      }

      if (isItemSearchTargetStatusRequestEvent(event.data)) {
        postItemSearchTargetStatus(event.data.requestId);
        return;
      }

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

  useEffect(() => {
    const channel = new BroadcastChannel("menu-events");

    channel.postMessage({
      type: "item-search-target-status",
      canAddToTicket:
        currentTab === 1 && Boolean(selectedTransactionTicket?.ticket_number),
      targetTicketNumber: selectedTransactionTicket?.ticket_number,
    });
    channel.close();
  }, [currentTab, selectedTransactionTicket?.ticket_number]);

  const handleSearch = ({ firstName, lastName }: SearchParams) => {
    setForcedClient(null);
    setSearchFirstName(firstName);
    setSearchLastName(lastName);
    setSearchDateOfBirth("");
    setCurrentTab(0);
    setSearchRequestKey((prev) => prev + 1);
  };

  const handleBirthdaySearch = ({ dateOfBirth }: BirthdaySearchParams) => {
    setForcedClient(null);
    setSearchFirstName("");
    setSearchLastName("");
    setSearchDateOfBirth(dateOfBirth);
    setCurrentTab(0);
    setSearchRequestKey((prev) => prev + 1);
  };

  const handleClear = () => {
    setForcedClient(null);
    setSearchFirstName("");
    setSearchLastName("");
    setSearchDateOfBirth("");
    setSearchRequestKey((prev) => prev + 1);
    setSelectedClient(null);
    setSelectedTransactionTicket(null);
    setIncomingTransactionTicket(null);
    setFocusTicketNumber(undefined);
    setHistoryRefreshKey((prev) => prev + 1);
  };

  const requestHistoryRefresh = () => {
    setHistoryRefreshKey((prev) => prev + 1);
  };

  const handleTabChange = (tab: number) => {
    setCurrentTab(tab);

    if (tab === 2) {
      setFocusTicketNumber(undefined);
      setHistoryActivationKey((prev) => prev + 1);
    }
  };

  const handlePayment = () => {
    void getAppApi()?.window.openPaymentWindow({
      clientNumber: selectedClient?.client_number,
      clientLastName: selectedClient?.last_name,
      clientFirstName: selectedClient?.first_name,
    });
  };

  const handleOpenTicketSearch = () => {
    void getAppApi()?.window.openTicketSearchWindow();
  };

  const handleOpenItemSearch = () => {
    void getAppApi()?.window.openItemSearchWindow();
  };

  const handleClientSoldTicket = () => {
    updateCurrentClient(selectedClient?.client_number, (client) => ({
      ...client,
      sell_count: Number(client.sell_count ?? 0) + 1,
      updated_at: new Date(),
    }));
  };

  const openItemSearchWithItems = (
    sourceTicket: Ticket,
    sourceItems: Item[],
    mode: ItemSearchPayloadMode,
    focusWindow = false,
  ) => {
    if (!sourceTicket.ticket_number) {
      return;
    }

    void getAppApi()?.window.openItemSearchWindow({
      sourceTicketNumber: sourceTicket.ticket_number,
      items: sourceItems,
      mode,
      focusWindow,
    });
  };

  const handleRepawnCreated = (ticket: Ticket) => {
    setIncomingTransactionTicket(ticket);
    setFocusTicketNumber(ticket.ticket_number);
    setFocusRequestId((prev) => prev + 1);
    setCurrentTab(1);
  };

  const handleRepawnPreview = (sourceTicket: Ticket, sourceItems: Item[]) => {
    openItemSearchWithItems(sourceTicket, sourceItems, "repawn", false);
  };

  const handleLoadHistoryItems = (
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => {
    openItemSearchWithItems(sourceTicket, sourceItems, "load", true);
  };

  return {
    state: {
      currentTab,
      searchFirstName,
      searchLastName,
      searchDateOfBirth,
      searchRequestKey,
      selectedClient,
      forcedClient,
      selectedTransactionTicket,
      incomingTransactionTicket,
      focusTicketNumber,
      focusRequestId,
      historyRefreshKey,
      historyActivationKey,
      transactionRefreshKey,
    },
    actions: {
      setCurrentTab,
      handleTabChange,
      setSelectedClient,
      setSelectedTransactionTicket,
      handleSearch,
      handleBirthdaySearch,
      handleClear,
      handlePayment,
      handleOpenTicketSearch,
      handleOpenItemSearch,
      handleClientSoldTicket,
      requestHistoryRefresh,
      handleRepawnCreated,
      handleRepawnPreview,
      handleLoadHistoryItems,
    },
  };
};
