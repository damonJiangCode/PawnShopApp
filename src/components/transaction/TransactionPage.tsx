import React from "react";
import { Ticket } from "../../../shared/models/Ticket";
import { Customer } from "../../../shared/models/Customer";
import CustomerBar from "./CustomerBar";
import { Paper } from "@mui/material";
import TicketTable from "./TicketTable";

// mock customer
const mockCustomer: Customer = {
  customer_number: 1001,
  first_name: "John",
  last_name: "Doe",
  middle_name: "A",
  date_of_birth: new Date("1990-05-15"),
  gender: "Male",
  hair_color: "Black",
  eye_color: "Brown",
  height_cm: 178,
  weight_kg: 75,
  address: "123 Main Street",
  postal_code: "V5K 0A1",
  city: "Vancouver",
  province: "BC",
  country: "Canada",
  email: "john.doe@example.com",
  phone: "604-123-4567",
  notes: "Test customer for UI development.",
  image_path: "/images/customers/john_doe.jpg",
  updated_at: new Date(),
  redeem_count: 3,
  expire_count: 1,
  overdue_count: 0,
  theft_count: 0,
  identifications: [
    {
      id: 123,
      customer_number: 123,
      id_type: "driver's licence",
      id_number: "abc123",
      updated_at: new Date(),
    },
  ],
};

// mock tickets
export const mockTickets: Ticket[] = [
  {
    ticket_number: 10001,
    pawn_datetime: new Date("2025-01-10T14:20:00"),
    due_date: new Date("2025-02-10"),
    pickup_datetime: undefined,
    location: "Vancouver",
    description: "Gold Necklace - 18K, 25g",
    pawn_price: 500,
    interest: 50,
    pickup_price: 550,
    status: "pawned",
    employee_id: 1,
    customer_number: 1001,
    last_payment_date: new Date("2025-01-10"),
  },
  {
    ticket_number: 10002,
    pawn_datetime: new Date("2024-12-28T10:05:00"),
    due_date: new Date("2025-01-28"),
    pickup_datetime: new Date("2025-01-05T11:15:00"),
    location: "Burnaby",
    description: "Apple MacBook Pro 2021 - 16GB RAM",
    pawn_price: 900,
    interest: 90,
    pickup_price: 990,
    status: "picked_up",
    employee_id: 2,
    customer_number: 1002,
    last_payment_date: new Date("2025-01-05"),
  },
  {
    ticket_number: 10003,
    pawn_datetime: new Date("2024-11-15T16:40:00"),
    due_date: new Date("2024-12-15"),
    pickup_datetime: undefined,
    location: "Richmond",
    description: "Sony A7 IV Camera Body",
    pawn_price: 1200,
    interest: 180,
    pickup_price: 1380,
    status: "expired",
    employee_id: 3,
    customer_number: 1003,
    last_payment_date: new Date("2024-12-01"),
  },
  {
    ticket_number: 10004,
    pawn_datetime: new Date("2025-01-02T09:45:00"),
    due_date: new Date("2025-02-02"),
    pickup_datetime: undefined,
    location: "Vancouver",
    description: "Rolex Oyster Perpetual Watch",
    pawn_price: 2500,
    interest: 250,
    pickup_price: 2750,
    status: "pawned",
    employee_id: 1,
    customer_number: 1004,
    last_payment_date: new Date("2025-01-02"),
  },
  {
    ticket_number: 10005,
    pawn_datetime: new Date("2024-12-05T13:30:00"),
    due_date: new Date("2025-01-05"),
    pickup_datetime: new Date("2025-01-03T15:00:00"),
    location: "Surrey",
    description: "Dell Gaming Laptop - RTX 4060",
    pawn_price: 700,
    interest: 70,
    pickup_price: 770,
    status: "picked_up",
    employee_id: 4,
    customer_number: 1001,
    last_payment_date: new Date("2025-01-03"),
  },
];

interface TransactionPageProps {
  customer: Customer;
}
const TransactionPage: React.FC<TransactionPageProps> = ({ customer }) => {
  customer = mockCustomer;
  return (
    <Paper elevation={0} sx={{ m: 2, maxWidth: 1200, minHeight: 750 }}>
      {customer ? (
        <>
          <CustomerBar customer={customer} />
          <TicketTable
            tickets={mockTickets}
            selectedTicketId={null}
            onSelect={() => {}}
          />
        </>
      ) : (
        <div>No available customer</div>
      )}
    </Paper>
  );
};

{
  //   const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  //   const [items, setItems] = useState<Item[]>(mockItems);
  //   const [selectedTicketId, setSelectedTicketId] = useState<
  //     number | string | null
  //   >(tickets[0]?.id ?? null);
  //   const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  //   const selectedTicket = useMemo(
  //     () =>
  //       tickets.find((t) => String(t.id) === String(selectedTicketId)) ?? null,
  //     [tickets, selectedTicketId]
  //   );
  //   const itemsForSelectedTicket = useMemo(
  //     () =>
  //       items.filter(
  //         (i) =>
  //           String(i.ticket_number) ===
  //           String(selectedTicket?.ticket_number ?? "")
  //       ),
  //     [items, selectedTicket]
  //   );
  //   // --- handlers (占位: 你把真实逻辑接后端) ---
  //   const handleAddTicket = () => {
  //     console.log("add ticket");
  //   };
  //   const handleEditTicket = (t: Ticket) => {
  //     console.log("edit ticket", t);
  //   };
  //   const handlePrintTicket = (t: Ticket) => {
  //     console.log("print ticket", t);
  //   };
  //   const handleTransferTicket = (t: Ticket) => {
  //     console.log("transfer ticket", t);
  //   };
  //   const handleExpireTicket = (t: Ticket) => {
  //     console.log("expire ticket", t);
  //   };
  //   const handleAddItem = () => {
  //     console.log("add item");
  //   };
  //   const handleEditItem = (it: Item) => {
  //     console.log("edit item", it);
  //   };
  //   const handleRemoveItem = (it: Item) => {
  //     console.log("remove item", it);
}

{
  /* <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={9}>
          <Paper sx={{ p: 1 }}>
            <TicketContent
              tickets={tickets}
              selectedTicketId={selectedTicketId}
              onSelect={(id) => {
                setSelectedTicketId(id);
                setSelectedItemId(null);
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper sx={{ p: 1 }}>
            <TicketButtons
              selectedTicket={selectedTicket}
              onAdd={handleAddTicket}
              onEdit={handleEditTicket}
              onPrint={handlePrintTicket}
              onTransfer={handleTransferTicket}
              onExpire={handleExpireTicket}
            />
          </Paper>
        </Grid> */
}

{
  /* 下半部分：items for selected ticket */
}
{
  /* <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {!selectedTicket ? (
              <Typography color="text.secondary">
                请选择左侧的票以查看物品。
              </Typography>
            ) : (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Items for Ticket #{selectedTicket.ticket_number}
                </Typography>

                <ItemContent
                  items={itemsForSelectedTicket}
                  selectedItemId={selectedItemId ?? undefined}
                  onSelectItem={(id) => setSelectedItemId(id)}
                  onAddItem={handleAddItem}
                  onEditItem={handleEditItem}
                  onRemoveItem={handleRemoveItem}
                />
              </Box>
            )}
          </Paper>
        </Grid> */
}

export default TransactionPage;
