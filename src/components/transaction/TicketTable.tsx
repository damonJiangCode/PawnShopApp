import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Tooltip } from "@mui/material";
import { Ticket } from "../../../shared/models/Ticket";

interface TicketTableProps {
  tickets: Ticket[];
  selectedTicket?: Ticket | null;
  onSelectTicket: (t: Ticket | null) => void;
}

const TicketTable: React.FC<TicketTableProps> = (props) => {
  const { tickets, selectedTicket, onSelectTicket } = props;
  const [clickedTicket, setClickedTicket] = useState<Ticket | null>(null);
  const columns: GridColDef[] = [
    { field: "ticket_number", headerName: "TXN#", width: 80 },
    {
      field: "transaction_datetime",
      headerName: "TXN_DT",
      width: 95,
      renderCell: (params) => {
        if (!params.value) return "";
        const fullDate = new Date(params.value).toISOString();
        const dateOnly = fullDate.slice(0, 10);
        return (
          <Tooltip title={fullDate} arrow>
            <span>{dateOnly}</span>
          </Tooltip>
        );
      },
    },
    { field: "location", headerName: "LOC", width: 60 },
    { field: "description", headerName: "DESC", width: 160 },
    {
      field: "due_date",
      headerName: "DUE_DT",
      width: 95,
      type: "date",
      valueFormatter: (value: Date | null) => {
        if (!value) return "";
        return value.toISOString().slice(0, 10);
      },
    },
    {
      field: "amount",
      headerName: "AMT$",
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
    {
      field: "interested_datetime",
      headerName: "INT_DT",
      width: 95,
      renderCell: (params) => {
        if (!params.value) return "---";
        const fullDate = new Date(params.value).toISOString();
        const dateOnly = fullDate.slice(0, 10);
        return (
          <Tooltip title={fullDate} arrow>
            <span>{dateOnly}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "employee_name",
      headerName: "ENAME",
      width: 90,
    },
  ];

  return (
    <Box sx={{ height: 300, width: "100%" }}>
      <DataGrid
        rowHeight={30}
        rows={tickets}
        columns={columns}
        getRowId={(row) => row.ticket_number}
        onRowClick={(params) => {
          const clickedTicket =
            tickets.find((t) => t.ticket_number === params.id) ?? null;
          console.log(
            "[TicketTable.tsx] Clicked ticket number:",
            clickedTicket?.ticket_number || null
          );
        }}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
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

          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#d0d7de",
          },
        }}
      />
    </Box>
  );
};

export default TicketTable;
