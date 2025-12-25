import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import { Ticket } from "../../../shared/models/Ticket";

interface TicketTableProps {
  tickets: Ticket[];
  selectedTicket?: Ticket;
  onTicketSelected: (t: Ticket) => void;
}

const TicketTable: React.FC<TicketTableProps> = (props) => {
  const { tickets, selectedTicket, onTicketSelected } = props;
  const columns: GridColDef[] = [
    { field: "ticket_number", headerName: "TXN#", width: 80 },

    {
      field: "transaction_datetime",
      headerName: "TXN_DATE",
      width: 95,
      // type: "date",
      // valueFormatter: (value: Date | null) => {
      //   if (!value) return "";
      //   return value.toISOString().slice(0, 10);
      // },
      renderCell: (params) => {
        if (!params.value) return "";
        const fullDate = new Date(params.value).toISOString(); // 完整 datetime
        const dateOnly = fullDate.slice(0, 10); // 只显示 YYYY-MM-DD

        return (
          <Tooltip title={fullDate} arrow>
            <span>{dateOnly}</span>
          </Tooltip>
        );
      },
    },
    { field: "location", headerName: "LOC", width: 90 },
    { field: "description", headerName: "DESC", width: 160 },
    {
      field: "due_date",
      headerName: "DUE_DATE",
      width: 95,
      type: "date",
      valueFormatter: (value: Date | null) => {
        if (!value) return "";
        return value.toISOString().slice(0, 10);
      },
    },
    {
      field: "amount",
      headerName: "PAWN$",
      width: 70,
      valueFormatter: (value: number | null) => {
        if (!value) return "";
        return value;
      },
    },
    {
      field: "interest",
      headerName: "INT$",
      width: 70,
      valueFormatter: (value: number | null) => {
        if (!value) return "";
        return value;
      },
    },
    {
      field: "pickup_amount",
      headerName: "PU$",
      width: 70,
      valueFormatter: (value: number | null) => {
        if (!value) return "";
        return value;
      },
    },

    // {
    //   field: "employee_id",
    //   headerName: "Employee ID",
    //   width: 140,
    // },

    // {
    //   field: "customer_number",
    //   headerName: "Customer #",
    //   width: 150,
    // },

    // {
    //   field: "last_payment_date",
    //   headerName: "Last Payment",
    //   width: 150,
    //   valueFormatter: (params) =>
    //     params.value ? new Date(params.value).toISOString().split("T")[0] : "",
    // },
  ];

  return (
    <div style={{ height: 350, width: "100%" }}>
      <DataGrid
        rows={tickets}
        columns={columns}
        getRowId={(row) => row.ticket_number}
        onRowClick={(params) => {
          const ticket = tickets.find((t) => t.ticket_number === params.id);
          if (ticket) onTicketSelected(ticket);
        }}
        sx={{
          border: "1px solid #ccc",

          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          },

          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "2px solid #bbb",
          },

          "& .MuiDataGrid-columnHeader": {
            borderRight: "1px solid #ddd",
            backgroundColor: "#fafafa",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      />
    </div>
  );
};

export default TicketTable;
