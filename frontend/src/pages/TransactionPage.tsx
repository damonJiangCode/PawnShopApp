import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";
import ClientBar from "../components/transaction/ClientBar";
import TicketTable from "../components/transaction/TicketTable";
import TicketButtons from "../components/transaction/TicketButtons";
import ItemTable from "../components/transaction/ItemTable";
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

  if (!clientNumber) {
    return (
      <Paper elevation={0} sx={{ p: 2, m: 2 }}>
        <Typography color="text.secondary">Please search and select a client first.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 2, m: 2, height: "calc(100vh - 170px)", minHeight: 680 }}>
      <Box sx={{ mb: 1.5 }}>
        <ClientBar client_last_name={clientLastName} client_first_name={clientFirstName} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: "calc(100% - 40px)" }}>
        <Box sx={{ display: "flex", gap: 2, flex: 7, minHeight: 360 }}>
          <Box sx={{ flex: 7, minWidth: 0 }}>
            <TicketTable
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={handleTicketSelected}
            />
          </Box>

          <Box sx={{ flex: 3, minWidth: 220 }}>
            <TicketButtons
              selectedTicket={selectedTicket}
              onAdd={handleAddButtonClick}
              onEdit={handleEditButtonClick}
              onPrint={handleTicketPrint}
              onChange={handleTicketChange}
              onExpire={handleTicketExpire}
            />
            {selectedTicket && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Status: {selectedTicket.status}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flex: 3, minHeight: 220 }}>
          <Box sx={{ flex: 7, minWidth: 0 }}>
            <ItemTable items={items} selectedItem={selectedItem ?? undefined} onItemSelected={handleItemClick} />
          </Box>

          <Box
            sx={{
              flex: 3,
              minWidth: 220,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          >
            {itemsLoading ? (
              <CircularProgress size={24} />
            ) : selectedItem ? (
              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Avatar
                  variant="rounded"
                  src={itemImageSrc ?? undefined}
                  sx={{ width: "100%", height: 190, borderRadius: 1, mb: 1 }}
                >
                  {selectedItem.description?.[0] ?? "I"}
                </Avatar>
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                  {selectedItem.image_path || "No image path"}
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">Select an item to preview image.</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
