import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import type { Ticket } from "../../../../shared/types/Ticket";
import CellTooltip from "../../shared/CellTooltip";
import {
  formatCurrency,
  formatIsoDate,
  formatIsoDateTime,
  formatUppercase,
} from "../../../utils/formatters";

interface TicketsTableProps {
  tickets: Ticket[];
  selectedTicket?: Ticket | null;
  onSelectTicket: (t: Ticket | null) => void;
}

const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
}) => {
  const getDueDate = (ticket: Ticket) => {
    if (ticket.status === "sold") return "";
    if (ticket.due_date) return formatIsoDate(ticket.due_date);
    if (!ticket.transaction_datetime) return "";
    const due = new Date(ticket.transaction_datetime);
    due.setDate(due.getDate() + 30);
    return formatIsoDate(due);
  };

  const columns: GridColDef[] = [
    {
      field: "ticket_number",
      headerName: "#",
      width: 80,
      renderCell: (params) => (
        <CellTooltip value={params.value} fallback="---" />
      ),
    },
    {
      field: "transaction_datetime",
      headerName: "DATE",
      width: 110,
      renderCell: (params) => (
        <CellTooltip
          value={params.value ? formatIsoDate(params.value) : null}
          title={params.value ? formatIsoDateTime(params.value) : "---"}
          fallback="---"
        />
      ),
    },
    {
      field: "location",
      headerName: "LOC",
      width: 72,
      renderCell: (params) => (
        <CellTooltip value={params.value} fallback="---" />
      ),
    },
    {
      field: "description",
      headerName: "DESC",
      width: 120,
      renderCell: (params) => (
        <CellTooltip value={params.value} fallback="---" />
      ),
    },
    {
      field: "due_date_display",
      headerName: "DUE",
      width: 132,
      valueGetter: (_value, row: Ticket) => getDueDate(row),
      renderCell: (params) => {
        const dueDate = params.value;
        const showOverdueIcon =
          params.row.status !== "sold" && params.row.is_overdue;

        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <CellTooltip value={dueDate} fallback="---" />
            {showOverdueIcon && (
              <Tooltip title="Overdue" arrow>
                <WarningAmberIcon sx={{ color: "#d32f2f", fontSize: 18 }} />
              </Tooltip>
            )}
          </Box>
        );
      },
    },
    {
      field: "amount",
      headerName: "AMT",
      width: 84,
      renderCell: (params) => (
        <CellTooltip value={formatCurrency(params.value)} fallback="---" />
      ),
    },
    {
      field: "interest",
      headerName: "INT",
      width: 84,
      renderCell: (params) =>
        params.row.status === "sold" ? (
          <CellTooltip value={null} fallback="---" />
        ) : (
          <CellTooltip value={formatCurrency(params.value)} fallback="---" />
        ),
    },
    {
      field: "interested_datetime",
      headerName: "INT DATE",
      width: 110,
      renderCell: (params) => (
        <CellTooltip
          value={params.value ? formatIsoDate(params.value) : null}
          title={params.value ? formatIsoDateTime(params.value) : "---"}
          fallback="---"
        />
      ),
    },
    {
      field: "pickup_amount",
      headerName: "PKUP",
      width: 84,
      renderCell: (params) =>
        params.row.status === "sold" ? (
          <CellTooltip value={null} fallback="---" />
        ) : (
          <CellTooltip value={formatCurrency(params.value)} fallback="---" />
        ),
    },
    {
      field: "employee_name",
      headerName: "EMP",
      width: 120,
      renderCell: (params) => (
        <CellTooltip value={formatUppercase(params.value, "")} fallback="---" />
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        columnHeaderHeight={34}
        rowHeight={30}
        rows={tickets}
        columns={columns}
        getRowId={(row) => row.ticket_number}
        rowSelectionModel={
          selectedTicket?.ticket_number ? [selectedTicket.ticket_number] : []
        }
        onRowClick={(params) => {
          const clickedTicket =
            tickets.find((t) => t.ticket_number === params.id) ?? null;
          onSelectTicket(clickedTicket);
        }}
        disableColumnMenu
        disableColumnSorting
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
        localeText={{
          noRowsLabel: "No tickets",
        }}
        sx={{
          border: "1px solid #ccc",
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "2px solid #bbb",
          },
          "& .MuiDataGrid-columnHeader": {
            borderRight: "1px solid #ddd",
            backgroundColor: "#fafafa",
            py: 0,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f5f5f5",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#d0d7de",
          },
          "& .MuiDataGrid-row.Mui-selected:hover": {
            backgroundColor: "#c6d0d9",
          },
          "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
            borderRight: "1px solid #9aa4af",
            borderBottom: "1px solid #9aa4af",
          },
        }}
      />
    </Box>
  );
};

export default TicketsTable;
