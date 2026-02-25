import React, { useState } from "react";
import { Paper, Box } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
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

interface TransactionPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
}

const TransactionPage: React.FC<TransactionPageProps> = (props) => {
  const { clientNumber, clientLastName, clientFirstName } = props;
  const { tickets, loading: ticketsLoading } = useTickets(clientNumber);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { items, loading: itemsLoading } = useItems(
    selectedTicket?.ticket_number
  );
  const [openAddTicketForm, setOpenAddTicketForm] = useState(false);
  const [openEditTicketForm, setOpenEditTicketForm] = useState(false);
  const loading = ticketsLoading || itemsLoading;

  const handleTicketSelected = (t: Ticket | null) => {
    setSelectedTicket(t);
  };

  const handleAddButtonClick = () => {
    setOpenAddTicketForm(true);
  };

  const handleEditButtonClick = () => {
    setOpenEditTicketForm(true);
  };

  const handleTicketPrint = () => {
    console.log("Print ticket");
  };

  const handleTicketChange = () => {
    console.log("Change ticket");
  };

  const handleTicketExpire = () => {
    console.log("Expire ticket");
  };

  const handleAddTicket = (data: any) => {
    const { description, location, amount, oneTimeFee } = data;
    const transaction_date: Date = new Date();
    const due_date: Date = new Date(transaction_date);
    due_date.setDate(due_date.getDate() + 30);

    const employeeName = "TODO";
    const newTicket: Ticket = {
      transaction_datetime: transaction_date as unknown as Date,
      location,
      description,
      due_date: due_date as unknown as Date,
      amount,
      interest: Number((0.3 * amount).toFixed(1)),
      pickup_amount: Number((1.3 * amount).toFixed(1)),
      employee_name: employeeName,
      status: "pawned",
      client_number: clientNumber ?? 0,
    };
    console.log("[TransactionPage.tsx] New ticket:", newTicket, oneTimeFee);
    setOpenAddTicketForm(false);
  };

  const handleEditTicket = (_data: Partial<Ticket>) => {
    setOpenEditTicketForm(false);
  };

  const handleItemAdd = () => {
    console.log("Add item");
  };

  const handleItemEdit = (i: Item) => {
    console.log("Edit item", i);
  };

  const handleItemDelete = (i: Item) => {
    console.log("Delete item", i);
  };

  return (
    <Paper elevation={0} sx={{ m: 2, maxWidth: 1200, minHeight: 750 }}>
      {clientNumber ? (
        <>
          <Box>
            {loading && <HourglassBottomIcon />}
            <ClientBar
              client_last_name={clientLastName}
              client_first_name={clientFirstName}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 3.5,
            }}
          >
            <TicketTable
              tickets={tickets}
              onSelectTicket={handleTicketSelected}
            />
            <TicketButtons
              selectedTicket={selectedTicket}
              onAdd={handleAddButtonClick}
              onEdit={handleEditButtonClick}
              onPrint={handleTicketPrint}
              onChange={handleTicketChange}
              onExpire={handleTicketExpire}
            />
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
          </Box>
          <Box
            sx={{
              height: 50,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 3.5,
              m: 4,
            }}
          >
            <ItemTable
              items={items}
              onItemSelected={(item) => {
                setSelectedItem(item);
              }}
            />
            <ItemButtons
              selectedItem={selectedItem ?? undefined}
              onAdd={handleItemAdd}
              onEdit={handleItemEdit}
              onDelete={handleItemDelete}
            />
          </Box>
        </>
      ) : (
        <div>No available client</div>
      )}
    </Paper>
  );
};

export default TransactionPage;
