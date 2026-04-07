import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import type { Ticket } from "../../shared/types/Ticket";
import type { Item } from "../../shared/types/Item";
import ClientBar from "../components/transaction/ClientBar";
import TicketsPanel from "../components/ticket/TicketsPanel";
import ItemsPanel from "../components/item/ItemsPanel";
import PawnTicketDialog from "../components/ticket/dialogs/PawnTicketDialog";
import SellTicketDialog from "../components/ticket/dialogs/SellTicketDialog";
import TicketEditDialog from "../components/ticket/dialogs/TicketEditDialog";
import {
  ticketService,
  type CreatePawnTicketInput,
  type CreateSellTicketInput,
  type UpdateTicketInput,
} from "../services/ticketService";
import { itemService } from "../services/itemService";

interface TransactionPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
  clientMiddleName?: string;
}

const TransactionPage: React.FC<TransactionPageProps> = (props) => {
  const { clientNumber, clientLastName, clientFirstName, clientMiddleName } = props;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string>("");
  const [itemsError, setItemsError] = useState<string>("");
  const [openPawnTicketForm, setOpenPawnTicketForm] = useState(false);
  const [openSellTicketForm, setOpenSellTicketForm] = useState(false);
  const [openEditTicketForm, setOpenEditTicketForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const loading = ticketsLoading || itemsLoading;

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
        // console.log("trying to call fetchTickets()");
        const fetchedTickets = await ticketService.loadTickets(clientNumber);
        // console.log("fetchedTickets results: ", fetchedTickets);
        if (!active) {
          return;
        }

        setTickets(fetchedTickets);
        setSelectedTicket((prev) => {
          if (!fetchedTickets.length) {
            return null;
          }

          if (!prev) {
            return fetchedTickets[fetchedTickets.length - 1];
          }

          return (
            fetchedTickets.find(
              (ticket) => ticket.ticket_number === prev.ticket_number,
            ) ?? fetchedTickets[fetchedTickets.length - 1]
          );
        });
      } finally {
        if (!active) {
          return;
        }

        setTicketsLoading(false);
      }
    };

    fetchTickets();

    return () => {
      active = false;
    };
  }, [clientNumber]);

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

    fetchItems();

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
      items.find((item) => item.item_number === selectedItem.item_number) ??
      null;

    if (!matchedItem) {
      setSelectedItem(items[0] ?? null);
    }
  }, [items, selectedItem]);

  const handleTicketSelected = (ticket: Ticket | null) => {
    setSelectedTicket(ticket);
    setStatusMessage("");
  };

  const handlePawnButtonClick = () => {
    setOpenPawnTicketForm(true);
    setStatusMessage("");
  };

  const handleEditButtonClick = () => {
    setOpenEditTicketForm(true);
    setStatusMessage("");
  };

  const handleSellButtonClick = () => {
    setOpenSellTicketForm(true);
    setStatusMessage("");
  };

  const handleTicketPrint = () => {
    if (!selectedTicket) {
      return;
    }

    window.print();
  };

  const handleConvertTicket = () => {
    if (!selectedTicket) {
      return;
    }

    setStatusMessage(
      `Convert for ticket #${selectedTicket.ticket_number} is not wired yet.`,
    );
  };

  const handleTransferTicket = () => {
    if (!selectedTicket) {
      return;
    }

    setStatusMessage(
      `Transfer for ticket #${selectedTicket.ticket_number} is not wired yet.`,
    );
  };

  const handleTicketExpire = () => {
    if (!selectedTicket) {
      return;
    }

    const nextTicket: Ticket = {
      ...selectedTicket,
      status: "expired",
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_number === selectedTicket.ticket_number
          ? nextTicket
          : ticket,
      ),
    );
    setSelectedTicket(nextTicket);
    setStatusMessage(
      `Ticket #${selectedTicket.ticket_number} marked as expired.`,
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

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setItems([]);
    setSelectedItem(null);
    setOpenPawnTicketForm(false);
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

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setItems([]);
    setSelectedItem(null);
    setOpenSellTicketForm(false);
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
    setOpenEditTicketForm(false);
    setStatusMessage(`Ticket #${updatedTicket.ticket_number} updated.`);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setStatusMessage("");
  };

  const handleAddItem = () => {
    setStatusMessage("Add item is not wired yet.");
  };

  const handleEditItem = (_item: Item) => {
    setStatusMessage("Edit item is not wired yet.");
  };

  const handleRemoveItem = (item: Item) => {
    const nextItems = items.filter(
      (current) => current.item_number !== item.item_number,
    );

    setItems(nextItems);
    setSelectedItem((prev) => {
      if (prev?.item_number !== item.item_number) {
        return prev;
      }

      return nextItems[0] ?? null;
    });
    setStatusMessage(`Item #${item.item_number} removed from view.`);
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
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          mb: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          px: 1.5,
          py: 1,
          backgroundColor: "background.paper",
          boxShadow: 1,
        }}
      >
        <ClientBar
          client_last_name={clientLastName}
          client_first_name={clientFirstName}
          client_middle_name={clientMiddleName}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <TicketsPanel
          tickets={tickets}
          selectedTicket={selectedTicket}
          onSelectTicket={handleTicketSelected}
          onPawn={handlePawnButtonClick}
          onSell={handleSellButtonClick}
          onEdit={handleEditButtonClick}
          onPrint={handleTicketPrint}
          onConvert={handleConvertTicket}
          onTransfer={handleTransferTicket}
          onExpire={handleTicketExpire}
        />

        {(ticketsError || statusMessage) && (
          <Box sx={{ px: 0.5 }}>
            {ticketsError && (
              <Typography variant="body2" color="error">
                {ticketsError}
              </Typography>
            )}
            {statusMessage && (
              <Typography variant="body2" color="text.secondary">
                {statusMessage}
              </Typography>
            )}
          </Box>
        )}

        <Paper
          sx={{
            flex: 1,
            minHeight: 0,
            p: 1,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            boxShadow:
              "0 0 0 1px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
            boxSizing: "border-box",
            overflow: "hidden",
            backgroundColor: "background.paper",
          }}
        >
          <ItemsPanel
            items={items}
            selectedItem={selectedItem ?? undefined}
            loading={itemsLoading}
            error={itemsError}
            onItemSelected={handleItemClick}
            onAdd={handleAddItem}
            onEdit={handleEditItem}
            onDelete={handleRemoveItem}
          />
        </Paper>
      </Box>

      {loading && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ position: "absolute", right: 16, bottom: 10 }}
        >
          Loading data...
        </Typography>
      )}

      {openPawnTicketForm && (
        <PawnTicketDialog
          open={openPawnTicketForm}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => setOpenPawnTicketForm(false)}
          onSave={handlePawnTicket}
        />
      )}

      {openSellTicketForm && (
        <SellTicketDialog
          open={openSellTicketForm}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => setOpenSellTicketForm(false)}
          onSave={handleSellTicket}
        />
      )}

      {openEditTicketForm && (
        <TicketEditDialog
          open={openEditTicketForm}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          ticket={selectedTicket}
          onClose={() => setOpenEditTicketForm(false)}
          onSave={handleEditTicket}
        />
      )}
    </Paper>
  );
};

export default TransactionPage;
