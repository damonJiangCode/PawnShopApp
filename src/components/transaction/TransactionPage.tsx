import React, { useEffect, useState } from "react";
import { Ticket } from "../../../shared/models/Ticket";
import { Item } from "../../../shared/models/Item";
import CustomerBar from "./CustomerBar";
import { Paper, Box } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import TicketTable from "./TicketTable";
import TicketButtons from "./TicketButtons";
import ItemTable from "./ItemTable";
import ItemButtons from "./ItemButtons";
import AddTicketForm from "./AddTicketForm";
import EditTicketForm from "./EditTicketForm";

interface TransactionPageProps {
  customerNumber?: number;
  customerLastName?: string;
  customerFirstName?: string;
}

const TransactionPage: React.FC<TransactionPageProps> = (props) => {
  const { customerNumber, customerLastName, customerFirstName } = props;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [openAddTicketForm, setOpenAddTicketForm] = useState(false);
  const [openEditTicketForm, setOpenEditTicketForm] = useState(false);

  // fetch tickects when customer changes
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        if (!customerNumber) {
          setTickets([]);
          console.warn(
            "[TransactionPage.tsx] WARNING: fetchTickets() skipped, missing customer_number, ",
            customerNumber
          );
          return;
        }
        const tickets = await (window as any).electronAPI.getTickets(
          customerNumber
        );
        setTickets(tickets);
      } catch (err) {
        console.error(
          "[TransactionPage.tsx] ERROR: fetchTickets() skipped, ",
          err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [customerNumber]);

  // fetch items when ticket changes
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        if (!selectedTicket) {
          setItems([]);
          console.warn(
            "[TransactionPage.tsx] WARNING: fetchItems() skipped, missing selected ticket, ",
            selectedTicket
          );
          return;
        }
        // const items = await (window as any).electronAPI.getItems(
        //   selectedTicket
        // );
        const items = selectedTicket?.items || [];
        setItems(items);
      } catch (err) {
        console.error(
          "[TransactionPage.tsx] ERROR: fetchItems() skipped,",
          err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [selectedTicket]);

  const handleTicketSelected = (t: Ticket | null) => {
    setSelectedTicket(t);
  };

  const handleAddButtonClick = () => {
    setOpenAddTicketForm(true);
    console.log("Ticket add button clicked.");
  };
  const handleEditButtonClick = () => {
    setOpenEditTicketForm(true);
    console.log("Ticket edit button clicked");
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
    // console.log("[TransactionPage.tsx] Ticket data from [AddTicketForm.tsx]:", data);
    const { description, location, amount, oneTimeFee, employeePassword } =
      data;
    const transaction_date: Date = new Date();
    const due_date: Date = new Date(transaction_date);
    due_date.setDate(due_date.getDate() + 30);
    // TODO: get employee name from password

    const employeeName = "TODO";
    const newTicket: Ticket = {
      transaction_datetime: transaction_date.toISOString() as unknown as Date,
      location: location,
      description: description,
      due_date: due_date.toISOString() as unknown as Date,
      amount: amount,
      interest: Number((0.3 * amount).toFixed(1)),
      pickup_amount: Number((1.3 * amount).toFixed(1)),
      employee_name: employeeName,
      status: "pawned",
      customer_number: customerNumber!,
    };
    console.log("[TransactionPage.tsx] New ticket to be added:", newTicket);
    setOpenAddTicketForm(false);
  };

  const handleEditTicket = (data: any) => {
    console.log("Edit ticket data:", data);
    setOpenEditTicketForm(false);
  };

  // item button handlers
  const handleItemAdd = () => {
    // Implement add item logic
    console.log("Add item");
  };
  const handleItemEdit = (i: Item) => {
    // Implement edit item logic
    console.log("Edit item", i);
  };
  const handleItemDelete = (i: Item) => {
    // Implement delete item logic
    console.log("Delete item", i);
  };

  return (
    <Paper elevation={0} sx={{ m: 2, maxWidth: 1200, minHeight: 750 }}>
      {customerNumber ? (
        <>
          <Box>
            {loading && <HourglassBottomIcon />}
            <CustomerBar
              customer_last_name={customerLastName}
              customer_first_name={customerFirstName}
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
                customerFirstName={customerFirstName || ""}
                customerLastName={customerLastName || ""}
                onClose={() => setOpenAddTicketForm(false)}
                onSave={handleAddTicket}
              />
            )}
            {openEditTicketForm && (
              <EditTicketForm
                open={openEditTicketForm}
                customerFirstName={customerFirstName || ""}
                customerLastName={customerLastName || ""}
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
              onAdd={() => {
                handleItemAdd();
              }}
              onEdit={(item) => {
                handleItemEdit(item);
              }}
              onDelete={(item) => {
                handleItemDelete(item);
              }}
            />
          </Box>
        </>
      ) : (
        <div>No available customer</div>
      )}
    </Paper>
  );
};

export default TransactionPage;
