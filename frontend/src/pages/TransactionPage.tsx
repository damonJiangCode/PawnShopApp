import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";
import ClientBar from "../components/transaction/ClientBar";
import TicketTable from "../components/transaction/TicketTable";
import TicketButtons from "../components/transaction/TicketButtons";
import ItemTable from "../components/transaction/ItemTable";
import ItemButtons from "../components/transaction/ItemButtons";
import AddTicketForm from "../components/transaction/AddTicketForm";
import EditTicketForm from "../components/transaction/EditTicketForm";
import { useTickets } from "../hooks/useTickets";
import { useItems } from "../hooks/useItems";
import { useClientImage } from "../hooks/useClientImage";

interface TransactionPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
}

const TransactionPage: React.FC<TransactionPageProps> = (props) => {
  const { clientNumber, clientLastName, clientFirstName } = props;

  const { tickets: fetchedTickets, loading: ticketsLoading } = useTickets(clientNumber);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { items: fetchedItems, loading: itemsLoading } = useItems(selectedTicket?.ticket_number);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [openAddTicketForm, setOpenAddTicketForm] = useState(false);
  const [openEditTicketForm, setOpenEditTicketForm] = useState(false);

  const itemImageSrc = useClientImage(selectedItem?.image_path);
  const loading = ticketsLoading || itemsLoading;

  useEffect(() => {
    setTickets(fetchedTickets);
  }, [fetchedTickets, clientNumber]);

  useEffect(() => {
    if (!selectedTicket) {
      setItems([]);
      setSelectedItem(null);
      return;
    }
    setItems(fetchedItems);
    setSelectedItem((prev) => {
      if (!prev) return fetchedItems[0] ?? null;
      return fetchedItems.find((i) => i.item_number === prev.item_number) ?? fetchedItems[0] ?? null;
    });
  }, [fetchedItems, selectedTicket]);

  useEffect(() => {
    if (!selectedTicket) return;
    const exists = tickets.some((t) => t.ticket_number === selectedTicket.ticket_number);
    if (!exists) {
      setSelectedTicket(tickets[0] ?? null);
    }
  }, [tickets, selectedTicket]);

  useEffect(() => {
    if (selectedTicket || tickets.length === 0) return;
    setSelectedTicket(tickets[0]);
  }, [tickets, selectedTicket]);

  const nextTicketNumber = useMemo(() => {
    const maxNo = tickets.reduce((max, t) => {
      const no = Number(t.ticket_number ?? 0);
      return no > max ? no : max;
    }, 0);
    return maxNo + 1;
  }, [tickets]);

  const handleTicketSelected = (ticket: Ticket | null) => {
    setSelectedTicket(ticket);
  };

  const handleAddButtonClick = () => {
    setOpenAddTicketForm(true);
  };

  const handleEditButtonClick = () => {
    setOpenEditTicketForm(true);
  };

  const handleTicketPrint = () => {
    if (!selectedTicket) return;
    window.print();
  };

  const handleTicketChange = () => {
    if (!selectedTicket || !clientNumber) return;
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.ticket_number !== selectedTicket.ticket_number) return ticket;
        return { ...ticket, client_number: clientNumber };
      })
    );
    alert(`Ticket #${selectedTicket.ticket_number} is now assigned to client #${clientNumber}.`);
  };

  const handleTicketExpire = () => {
    if (!selectedTicket) return;
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.ticket_number !== selectedTicket.ticket_number) return ticket;
        return { ...ticket, status: "expired" };
      })
    );
  };

  const handleAddTicket = (data: {
    description: string;
    location: string;
    amount: number;
    oneTimeFee: number;
    employeePassword: string;
  }) => {
    if (!clientNumber) return;

    const transactionDate = new Date();
    const dueDate = new Date(transactionDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const newTicket: Ticket = {
      ticket_number: nextTicketNumber,
      transaction_datetime: transactionDate,
      location: data.location,
      description: data.description,
      due_date: dueDate,
      amount: data.amount,
      interest: Number((0.3 * data.amount).toFixed(2)),
      pickup_amount: Number((1.3 * data.amount + data.oneTimeFee).toFixed(2)),
      employee_name: "CURRENT_EMPLOYEE",
      status: "pawned",
      client_number: clientNumber,
      items: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setOpenAddTicketForm(false);
  };

  const handleEditTicket = (data: Partial<Ticket>) => {
    if (!selectedTicket) return;

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.ticket_number !== selectedTicket.ticket_number) return ticket;
        const nextAmount = typeof data.amount === "number" ? data.amount : ticket.amount;
        return {
          ...ticket,
          ...data,
          amount: nextAmount,
          interest: Number((0.3 * nextAmount).toFixed(2)),
          pickup_amount: Number((1.3 * nextAmount).toFixed(2)),
        };
      })
    );

    setSelectedTicket((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...data,
      };
    });

    setOpenEditTicketForm(false);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleAddItem = () => {
    alert("Add Item form is not wired yet.");
  };

  const handleEditItem = (_item: Item) => {
    alert("Edit Item form is not wired yet.");
  };

  const handleRemoveItem = (item: Item) => {
    setItems((prev) => prev.filter((current) => current.item_number !== item.item_number));
    setSelectedItem((prev) =>
      prev?.item_number === item.item_number ? null : prev
    );
  };

  if (!clientNumber) {
    return (
      <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
        <Typography color="text.secondary">Please search and select a client first.</Typography>
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
                  <Avatar
                    variant="rounded"
                    src={itemImageSrc ?? undefined}
                    sx={{ width: "100%", height: "100%", borderRadius: 0.75 }}
                  >
                    {selectedItem.description?.[0] ?? "I"}
                  </Avatar>
                ) : (
                  <Typography color="text.secondary">
                    Select an item
                  </Typography>
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
