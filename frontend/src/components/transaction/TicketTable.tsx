import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";
import type { Ticket } from "../../../../shared/types/Ticket";

interface TicketTableProps {
  tickets: Ticket[];
  selectedTicket?: Ticket | null;
  onSelectTicket: (t: Ticket | null) => void;
}

const TicketTable: React.FC<TicketTableProps> = (props) => {
  const { tickets, selectedTicket, onSelectTicket } = props;

  const formatDate = (value?: string | Date | null) => {
    if (!value) return "";
    return new Date(value).toISOString().slice(0, 10);
  };

  const formatDateTime = (value?: string | Date | null) => {
    if (!value) return "";
    const date = new Date(value);
    const datePart = date.toISOString().slice(0, 10);
    const timePart = date.toTimeString().slice(0, 8);
    return `${datePart} ${timePart}`;
  };

  const getDueDate = (ticket: Ticket) => {
    if (ticket.due_date) return formatDate(ticket.due_date);
    if (!ticket.transaction_datetime) return "";
    const due = new Date(ticket.transaction_datetime);
    due.setDate(due.getDate() + 30);
    return formatDate(due);
  };

  const columns: GridColDef[] = [
    { field: "ticket_number", headerName: "Transaction #", width: 120 },
    {
      field: "transaction_datetime",
      headerName: "Transaction Time",
      width: 180,
      renderCell: (params) => {
        return (
          <Tooltip title={formatDateTime(params.value)} arrow>
            <span>{formatDateTime(params.value)}</span>
          </Tooltip>
        );
      },
    },
    { field: "description", headerName: "Description", width: 240, flex: 1 },
    {
      field: "due_date_display",
      headerName: "Due Date",
      width: 120,
      valueGetter: (_value, row: Ticket) => getDueDate(row),
    },
    {
      field: "interested_datetime",
      headerName: "Interest Time",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "---";
        return (
          <Tooltip title={formatDateTime(params.value)} arrow>
            <span>{formatDateTime(params.value)}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
      width: 150,
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rowHeight={30}
        rows={tickets}
        columns={columns}
        getRowId={(row) => row.ticket_number}
        rowSelectionModel={selectedTicket?.ticket_number ? [selectedTicket.ticket_number] : []}
        onRowClick={(params) => {
          const clickedTicket =
            tickets.find((t) => t.ticket_number === params.id) ?? null;
          onSelectTicket(clickedTicket);
        }}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
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
