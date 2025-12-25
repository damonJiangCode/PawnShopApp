import React, { useEffect, useState } from "react";
import { Ticket } from "../../../shared/models/Ticket";
import { Item } from "../../../shared/models/Item";
import { Customer } from "../../../shared/models/Customer";
import CustomerBar from "./CustomerBar";
import { Paper, Box } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import TicketTable from "./TicketTable";
import TicketButtons from "./TicketButtons";
import ItemTable from "./ItemTable";
import ItemButtons from "./ItemButtons";

interface TransactionPageProps {
  customer?: Customer;
}

const TransactionPage: React.FC<TransactionPageProps> = (props) => {
  const { customer } = props;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // fetch tickects when customer changes
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        if (!customer || !customer.customer_number) {
          setTickets([]);
          console.warn(
            "[TransactionPage.tsx] WARNING: fetchTickets skipped, missing customer or customer_number, ",
            customer
          );
          return;
        }
        const tickets = await (window as any).electronAPI.getTickets(
          customer.customer_number
        );
        setTickets(tickets);
      } catch (err) {
        console.error(
          "[TransactionPage.tsx] ERROR: fetchTickets skipped, ",
          err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [customer]);

  // fetch items when selectedTicket changed
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        if (!selectedTicket) {
          setItems([]);
          console.warn(
            "[TransactionPage.tsx] WARNING: fetchItems skipped, missing selectedTicket, ",
            selectedTicket
          );
          return;
        }
        const items = await (window as any).electronAPI.getItems(
          selectedTicket
        );
        setItems(items);
      } catch (err) {
        console.error("[TransactionPage.tsx] ERROR: fetchItems skipped,", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [selectedTicket]);

  // ticket button handlers
  const handleTicketAdd = () => {
    // Implement add ticket logic
    console.log("Add ticket");
  };
  const handleTicketEdit = (t: Ticket) => {
    // Implement edit ticket logic
    console.log("Edit ticket", t);
  };
  const handleTicketPrint = (t: Ticket) => {
    // Implement print ticket logic
    console.log("Print ticket", t);
  };
  const handleTicketChange = (t: Ticket) => {
    // Implement change ticket logic
    console.log("Change ticket", t);
  };
  const handleTicketExpire = (t: Ticket) => {
    // Implement expire ticket logic
    console.log("Expire ticket", t);
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
      {customer ? (
        <>
          <Box>
            {loading && <HourglassBottomIcon />}
            <CustomerBar customer={customer} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 3.5,
              m: 4,
            }}
          >
            <TicketTable
              tickets={tickets}
              onTicketSelected={(ticket) => {
                setSelectedTicket(ticket);
              }}
            />
            <TicketButtons
              onAdd={() => {
                handleTicketAdd();
              }}
              onEdit={(t) => {
                handleTicketEdit(t);
              }}
              onPrint={(t) => {
                handleTicketPrint(t);
              }}
              onChange={(t) => {
                handleTicketChange(t);
              }}
              onExpire={(t) => {
                handleTicketExpire(t);
              }}
            />
          </Box>
          {/* <Box
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
          </Box> */}
        </>
      ) : (
        <div>No available customer</div>
      )}
    </Paper>
  );
};

export default TransactionPage;
