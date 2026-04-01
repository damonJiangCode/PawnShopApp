import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";
import ClientBar from "../components/transaction/header/ClientBar";
import TicketTable from "../components/transaction/tickets/TicketTable";
import TicketButtons from "../components/transaction/tickets/TicketButtons";
import ItemTable from "../components/transaction/items/ItemTable";
import ItemButtons from "../components/transaction/items/ItemButtons";
import AddTicketForm from "../components/transaction/tickets/AddTicketForm";
import EditTicketForm from "../components/transaction/tickets/EditTicketForm";
import { transactionService } from "../services/transactionService";

interface TransactionPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
}

type AddTicketInput = {
  description: string;
  location: string;
  amount: number;
  onetime_fee: number;
  employee_password: string;
};

const TransactionPage: React.FC<TransactionPageProps> = (props) => {
  const { clientNumber, clientLastName, clientFirstName } = props;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string>("");
  const [itemsError, setItemsError] = useState<string>("");
  const [openAddTicketForm, setOpenAddTicketForm] = useState(false);
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
        const fetchedTickets =
          await transactionService.loadTickets(clientNumber);
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
        const fetchedItems = await transactionService.loadItems(
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

  const handleAddButtonClick = () => {
    setOpenAddTicketForm(true);
    setStatusMessage("");
  };

  const handleEditButtonClick = () => {
    setOpenEditTicketForm(true);
    setStatusMessage("");
  };

  const handleTicketPrint = () => {
    if (!selectedTicket) {
      return;
    }

    window.print();
  };

  const handleTicketChange = () => {
    if (!selectedTicket || !clientNumber) {
      return;
    }

    const nextTicket = {
      ...selectedTicket,
      client_number: clientNumber,
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
      `Ticket #${selectedTicket.ticket_number} is assigned to client #${clientNumber}.`,
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

  const handleAddTicket = async (ticketData: AddTicketInput): Promise<void> => {
    if (!clientNumber) {
      throw new Error("Please select a client first.");
    }

    const newTicket = await transactionService.createTicket({
      ...ticketData,
      client_number: clientNumber,
    });

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setItems([]);
    setSelectedItem(null);
    setOpenAddTicketForm(false);
    setStatusMessage(`Ticket #${newTicket.ticket_number} added.`);
  };

  const handleEditTicket = (data: Partial<Ticket>) => {
    if (!selectedTicket) {
      return;
    }

    const nextAmount =
      typeof data.amount === "number" ? data.amount : selectedTicket.amount;
    const nextTicket: Ticket = {
      ...selectedTicket,
      ...data,
      amount: nextAmount,
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_number === selectedTicket.ticket_number
          ? nextTicket
          : ticket,
      ),
    );
    setSelectedTicket(nextTicket);
    setOpenEditTicketForm(false);
    setStatusMessage(`Ticket #${nextTicket.ticket_number} updated.`);
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
        <Box
          sx={{
            flex: "0 0 56%",
            minHeight: 0,
            display: "flex",
            gap: 1,
          }}
        >
          <Paper
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              p: 1,
              border: "2px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              boxShadow:
                "0 0 0 3px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <TicketTable
                tickets={tickets}
                selectedTicket={selectedTicket}
                onSelectTicket={handleTicketSelected}
              />
            </Box>
          </Paper>

          <Paper
            sx={{
              width: 280,
              minHeight: 0,
              p: 1.25,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              boxSizing: "border-box",
            }}
          >
            <TicketButtons
              selectedTicket={selectedTicket}
              onAdd={handleAddButtonClick}
              onEdit={handleEditButtonClick}
              onPrint={handleTicketPrint}
              onChange={handleTicketChange}
              onExpire={handleTicketExpire}
            />
            <Divider />
            <Box sx={{ display: "grid", gap: 0.75 }}>
              <Typography variant="body2">
                Status: {selectedTicket?.status ?? "---"}
              </Typography>
              <Typography variant="body2">
                Location: {selectedTicket?.location ?? "---"}
              </Typography>
              <Typography variant="body2">
                Amount:{" "}
                {typeof selectedTicket?.amount === "number"
                  ? `$${selectedTicket.amount.toFixed(2)}`
                  : "---"}
              </Typography>
              <Typography variant="body2">
                Pickup:{" "}
                {typeof selectedTicket?.pickup_amount === "number"
                  ? `$${selectedTicket.pickup_amount.toFixed(2)}`
                  : "---"}
              </Typography>
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
          </Paper>
        </Box>

        <Paper
          sx={{
            flex: 1,
            minHeight: 0,
            p: 1,
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            boxShadow:
              "0 0 0 3px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 0.75,
              height: "100%",
              minHeight: 0,
              alignItems: "stretch",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
              <ItemTable
                items={items}
                selectedItem={selectedItem ?? undefined}
                onItemSelected={handleItemClick}
              />
            </Box>

            <Paper
              sx={{
                width: 320,
                border: "1px solid",
                borderColor: "divider",
                minHeight: 0,
                height: "100%",
                overflow: "hidden",
                flexShrink: 0,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "stretch",
                gap: 0.75,
                p: 0.75,
              }}
            >
              <Box
                sx={{
                  width: 210,
                  flexShrink: 0,
                  height: "100%",
                  backgroundColor: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 0.75,
                  overflow: "hidden",
                }}
              >
                {itemsLoading ? (
                  <CircularProgress size={24} />
                ) : selectedItem ? (
                  <Typography color="text.secondary">img area</Typography>
                ) : (
                  <Typography color="text.secondary">Select an item</Typography>
                )}
              </Box>

              <Box
                sx={{
                  width: 92,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <ItemButtons
                  selectedItem={selectedItem ?? undefined}
                  onAdd={handleAddItem}
                  onEdit={handleEditItem}
                  onDelete={handleRemoveItem}
                />
                {itemsError && (
                  <Typography variant="caption" color="error">
                    {itemsError}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Box>
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

      {openAddTicketForm && (
        <AddTicketForm
          open={openAddTicketForm}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          onClose={() => setOpenAddTicketForm(false)}
          onSave={handleAddTicket}
        />
      )}

      {openEditTicketForm && (
        <EditTicketForm
          open={openEditTicketForm}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          ticket={selectedTicket}
          onClose={() => setOpenEditTicketForm(false)}
          onSave={handleEditTicket}
        />
      )}
    </Paper>
  );
};

export default TransactionPage;
