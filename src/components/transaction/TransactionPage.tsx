// import React from "react";
// import { Customer } from "../../../shared/models/Customer";
// import TicketTable from "./TicketTable";
// import { Paper } from "@mui/material";

// const TransactionPage: React.FC<{ customer?: Customer }> = ({ customer }) => {
//   return (
//     <Paper elevation={10} sx={{ p: 5, m: 2, maxWidth: 1000, minHeight: 750 }}>
//       <TicketTable />
//       {/* {customer ? (
//         <TicketTable />
//       ) : (
//         <div>No available transactions</div>
//       )} */}
//     </Paper>
//   );
// };

// export default TransactionPage;

// types.ts
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  // ...other client fields
}

export interface Item {
  id: number;
  ticket_number: number;
  description: string;
  quantity?: number;
  photoUrl?: string;
  estimated_value?: number;
}

export interface Ticket {
  id: string | number; // unique id (后端 id)
  ticket_number: number;
  pawn_datetime?: string; // ISO string
  due_date?: string; // ISO string
  pickup_datetime?: string | null;
  location?: string;
  description?: string;
  pawn_price?: number;
  interest?: number;
  pickup_price?: number;
  status?: "pawned" | "picked_up" | "forfeited";
  employee_id?: number;
  customer_number?: number;
}

// TransactionPage.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";

// --- mock data (用你的数据替换) ---
const mockClient: Client = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  phone: "555-1234",
};

const mockTickets: Ticket[] = [
  {
    id: 1,
    ticket_number: 1,
    pawn_datetime: "2025-09-01",
    due_date: "2025-10-01",
    location: "RR T",
    description: "Gold Ring",
    pawn_price: 501,
    interest: 50,
    pickup_price: 551,
    status: "pawned",
    employee_id: 101,
    customer_number: 1001,
  },
  {
    id: 2,
    ticket_number: 2,
    pawn_datetime: "2025-09-02",
    due_date: "2025-10-02",
    location: "AB12",
    description: "Silver Necklace",
    pawn_price: 301,
    interest: 30,
    pickup_price: 331,
    status: "picked_up",
    employee_id: 102,
    customer_number: 1002,
  },
  // ...更多
];

const mockItems: Item[] = [
  {
    id: 11,
    ticket_number: 1,
    description: "Gold ring - 14k",
    photoUrl: "",
    estimated_value: 700,
  },
  {
    id: 12,
    ticket_number: 1,
    description: "Box + Certificate",
    photoUrl: "",
    estimated_value: 50,
  },
  {
    id: 21,
    ticket_number: 2,
    description: "Silver necklace",
    photoUrl: "",
    estimated_value: 200,
  },
];

// ----------------- 子组件 ------------------
const TicketContent: React.FC<{
  tickets: Ticket[];
  selectedTicketId?: number | string | null;
  onSelect: (id: number | string) => void;
}> = ({ tickets, selectedTicketId, onSelect }) => {
  const format = (iso?: string) => (iso ? iso.split("T")[0] : "");
  return (
    <TableContainer sx={{ maxHeight: 320 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ticket #</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Pawn $</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((t) => {
            const isSelected = String(t.id) === String(selectedTicketId);
            return (
              <TableRow
                hover
                key={t.id}
                selected={isSelected}
                onClick={() => onSelect(t.id)}
                sx={{
                  cursor: "pointer",
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.action.selected,
                  },
                }}
              >
                <TableCell>{t.ticket_number}</TableCell>
                <TableCell>{format(t.pawn_datetime)}</TableCell>
                <TableCell>{t.location}</TableCell>
                <TableCell title={t.description}>{t.description}</TableCell>
                <TableCell>{format(t.due_date)}</TableCell>
                <TableCell>{t.pawn_price}</TableCell>
                <TableCell>
                  <Typography variant="body2">{t.status}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TicketButtons: React.FC<{
  selectedTicket?: Ticket | null;
  onAdd: () => void;
  onEdit: (t: Ticket) => void;
  onPrint: (t: Ticket) => void;
  onTransfer: (t: Ticket) => void;
  onExpire: (t: Ticket) => void;
}> = ({ selectedTicket, onAdd, onEdit, onPrint, onTransfer, onExpire }) => {
  const disabled = !selectedTicket;
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
        Add
      </Button>
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => selectedTicket && onEdit(selectedTicket)}
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        startIcon={<PrintIcon />}
        onClick={() => selectedTicket && onPrint(selectedTicket)}
        disabled={disabled}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        onClick={() => selectedTicket && onTransfer(selectedTicket)}
        disabled={disabled}
      >
        Transfer
      </Button>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => selectedTicket && onExpire(selectedTicket)}
        disabled={disabled}
      >
        Expire
      </Button>
    </Box>
  );
};

const ItemContent: React.FC<{
  items: Item[];
  selectedItemId?: number | null;
  onSelectItem: (id: number) => void;
  onAddItem: () => void;
  onEditItem: (item: Item) => void;
  onRemoveItem: (item: Item) => void;
}> = ({
  items,
  selectedItemId,
  onSelectItem,
  onAddItem,
  onEditItem,
  onRemoveItem,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle1">Items</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Est Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((it) => (
                <TableRow
                  key={it.id}
                  hover
                  selected={it.id === selectedItemId}
                  onClick={() => onSelectItem(it.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{it.id}</TableCell>
                  <TableCell>{it.description}</TableCell>
                  <TableCell>{it.estimated_value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Grid item xs={3}>
        <Paper
          sx={{
            p: 1,
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 简单展示第一个 item 的图片或占位 */}
          {items.length ? (
            <Avatar variant="rounded" sx={{ width: 120, height: 120 }}>
              {/* 可改成 <img src=... /> */}
            </Avatar>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No photo
            </Typography>
          )}
        </Paper>
      </Grid>

      <Grid
        item
        xs={2}
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Button
            variant="contained"
            onClick={onAddItem}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const it = items.find((i) => i.id === selectedItemId!);
              if (it) onEditItem(it);
            }}
            disabled={!selectedItemId}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              const it = items.find((i) => i.id === selectedItemId!);
              if (it) onRemoveItem(it);
            }}
            disabled={!selectedItemId}
          >
            Remove
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

// ----------------- 主容器 ------------------
const TransactionPage: React.FC<{ client?: Client }> = ({
  client = mockClient,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [selectedTicketId, setSelectedTicketId] = useState<
    number | string | null
  >(tickets[0]?.id ?? null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const selectedTicket = useMemo(
    () =>
      tickets.find((t) => String(t.id) === String(selectedTicketId)) ?? null,
    [tickets, selectedTicketId]
  );
  const itemsForSelectedTicket = useMemo(
    () =>
      items.filter(
        (i) =>
          String(i.ticket_number) ===
          String(selectedTicket?.ticket_number ?? "")
      ),
    [items, selectedTicket]
  );

  // --- handlers (占位: 你把真实逻辑接后端) ---
  const handleAddTicket = () => {
    console.log("add ticket");
  };
  const handleEditTicket = (t: Ticket) => {
    console.log("edit ticket", t);
  };
  const handlePrintTicket = (t: Ticket) => {
    console.log("print ticket", t);
  };
  const handleTransferTicket = (t: Ticket) => {
    console.log("transfer ticket", t);
  };
  const handleExpireTicket = (t: Ticket) => {
    console.log("expire ticket", t);
  };

  const handleAddItem = () => {
    console.log("add item");
  };
  const handleEditItem = (it: Item) => {
    console.log("edit item", it);
  };
  const handleRemoveItem = (it: Item) => {
    console.log("remove item", it);
  };

  return (
    <Box p={2}>
      {/* client bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h6">Transaction - Tickets</Typography>
            {client && (
              <Typography variant="subtitle2" color="text.secondary">
                Client: {client.firstName} {client.lastName}{" "}
                {client.phone ? `· ${client.phone}` : ""}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Typography variant="caption" color="text.secondary">
              Store: Main
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 上半部分：ticket content + ticket buttons */}
      <Grid container spacing={2} alignItems="stretch">
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
        </Grid>

        {/* 下半部分：items for selected ticket */}
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionPage;
