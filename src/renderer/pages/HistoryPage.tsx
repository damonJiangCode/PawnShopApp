import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { Ticket } from "../../shared/types/Ticket";
import type { Item } from "../../shared/types/Item";
import ClientBar from "../components/shared/ClientBar";
import HistoryTicketsPanel from "../components/history/tickets/HistoryTicketsPanel";
import HistoryItemsPanel from "../components/history/items/HistoryItemsPanel";
import TicketPawnDialog from "../components/transaction/dialogs/TicketPawnDialog";
import ItemEditDialog from "../components/transaction/dialogs/ItemEditDialog";
import { itemService } from "../services/itemService";
import type { ItemCategoryOption } from "../services/itemService";
import { ticketService, type CreatePawnTicketInput } from "../services/ticketService";
import { windowService } from "../services/windowService";

interface HistoryPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
  clientMiddleName?: string;
  transactionTargetTicket?: Ticket | null;
  onRepawnCreated?: (
    ticket: Ticket,
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => void;
  onLoadItemsToTransaction?: (sourceTicket: Ticket, sourceItems: Item[]) => void;
}

const historyTicketStatuses = new Set<Ticket["status"]>([
  "expired",
  "picked_up",
  "sold",
]);

const HistoryPage: React.FC<HistoryPageProps> = ({
  clientNumber,
  clientLastName,
  clientFirstName,
  clientMiddleName,
  transactionTargetTicket,
  onRepawnCreated,
  onLoadItemsToTransaction,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [openRepawnDialog, setOpenRepawnDialog] = useState(false);
  const [openItemEditDialog, setOpenItemEditDialog] = useState(false);
  const [itemCategories, setItemCategories] = useState<ItemCategoryOption[]>([]);
  const transactionTargetTicketRef = useRef<Ticket | null>(transactionTargetTicket ?? null);

  useEffect(() => {
    transactionTargetTicketRef.current = transactionTargetTicket ?? null;
  }, [transactionTargetTicket]);

  useEffect(() => {
    let active = true;

    itemService.preloadCategories().then((categories) => {
      if (active) {
        setItemCategories(categories);
      }
    }).catch((err) => {
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
      const historyTickets = fetchedTickets.filter((ticket) =>
        historyTicketStatuses.has(ticket.status),
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
  }, [clientNumber]);

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      if (!selectedTicket?.ticket_number) {
        setItems([]);
        setSelectedItem(null);
        return;
      }

      setItemsLoading(true);
      const fetchedItems = await itemService.loadItems(selectedTicket.ticket_number);

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
      setStatusMessage("Select or create a transaction ticket before loading items.");
      return;
    }

    onLoadItemsToTransaction?.(sourceTicket, selectedItems);
  };

  if (!clientNumber) {
    return (
      <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
        <Typography color="text.secondary">
          Please search and select a client first.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: "100%",
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <ClientBar
        client_last_name={clientLastName}
        client_first_name={clientFirstName}
        client_middle_name={clientMiddleName}
        sx={{ mb: 1 }}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "hidden",
        }}
      >
        <HistoryTicketsPanel
          tickets={tickets}
          selectedTicket={selectedTicket}
          loading={ticketsLoading}
          onSelectTicket={(ticket) => {
            setSelectedTicket(ticket);
            setStatusMessage("");
          }}
          onRepawn={handleRepawn}
          onLoad={handleLoad}
        />

        {statusMessage && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
            {statusMessage}
          </Typography>
        )}

        <HistoryItemsPanel
          items={items}
          selectedItem={selectedItem}
          loading={itemsLoading}
          onSelectItem={setSelectedItem}
          onEditItem={handleEditItem}
        />
      </Box>

      {openRepawnDialog && selectedTicket && (
        <TicketPawnDialog
          open={openRepawnDialog}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          dialogTitle={`Repawn Ticket #${selectedTicket.ticket_number}`}
          saveLabel="Repawn"
          initialValues={{
            description: selectedTicket.description,
            location: selectedTicket.location,
            amount: selectedTicket.amount,
            onetime_fee: selectedTicket.onetime_fee,
          }}
          onClose={() => setOpenRepawnDialog(false)}
          onSave={handleRepawnSave}
        />
      )}

      {openItemEditDialog && selectedTicket?.ticket_number && (
        <ItemEditDialog
          open={openItemEditDialog}
          mode="edit"
          ticketNumber={selectedTicket.ticket_number}
          item={selectedItem}
          categories={itemCategories}
          onClose={() => setOpenItemEditDialog(false)}
          onSave={handleItemSaved}
        />
      )}
    </Paper>
  );
};

export default HistoryPage;
