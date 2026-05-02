import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Ticket } from "../../../../shared/types/Ticket";
import CellTooltip from "../../shared/CellTooltip";
import {
  formatCurrency,
  formatIsoDate,
  formatIsoDateTime,
  formatUppercase,
} from "../../../utils/formatters";

interface HistoryTicketsTableProps {
  tickets: Ticket[];
  selectedTicket?: Ticket | null;
  loading?: boolean;
  onSelectTicket: (ticket: Ticket | null) => void;
}

const HistoryTicketsTable: React.FC<HistoryTicketsTableProps> = ({
  tickets,
  selectedTicket,
  loading = false,
  onSelectTicket,
}) => {
  const columns = useMemo<GridColDef[]>(
    () => [
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
        width: 112,
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
        width: 160,
        renderCell: (params) => (
          <CellTooltip value={params.value} fallback="---" />
        ),
      },
      {
        field: "due_date",
        headerName: "DUE",
        width: 112,
        renderCell: (params) => (
          <CellTooltip
            value={params.value ? formatIsoDate(params.value) : null}
            fallback="---"
          />
        ),
      },
      {
        field: "amount",
        headerName: "AMT",
        width: 86,
        renderCell: (params) => (
          <CellTooltip value={formatCurrency(params.value)} fallback="---" />
        ),
      },
      {
        field: "pickup_datetime",
        headerName: "PKDATE",
        width: 112,
        renderCell: (params) => (
          <CellTooltip
            value={params.value ? formatIsoDate(params.value) : null}
            title={params.value ? formatIsoDateTime(params.value) : "---"}
            fallback="---"
          />
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
    ],
    [],
  );

  return (
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
          tickets.find((ticket) => ticket.ticket_number === params.id) ?? null;
        onSelectTicket(clickedTicket);
      }}
      loading={loading}
      disableColumnMenu
      disableColumnSorting
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      hideFooter
      localeText={{ noRowsLabel: "No tickets" }}
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
  );
};

export default HistoryTicketsTable;
