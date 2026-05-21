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

  useEffect(() => {
    const channel = new BroadcastChannel("payment-events");

    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type !== "payment-completed") {
        return;
      }

      setTransactionRefreshKey((prev) => prev + 1);
      setHistoryRefreshKey((prev) => prev + 1);
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
    setSelectedClient((prev) =>
      prev
        ? {
            ...prev,
            sold_count: Number(prev.sold_count ?? 0) + 1,
            updated_at: new Date(),
          }
        : prev,
    );
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
