import React, { useMemo } from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { Ticket } from "../../../../../shared/types/Ticket";
import CellTooltip from "../../../../shared/ui/CellTooltip";
import {
  formatCurrency,
  formatIsoDate,
  formatIsoDateTime,
  formatUppercase,
} from "../../../../shared/utils/formatters";

interface HistoryTicketsTableProps {
  tickets: Ticket[];
  selectedTicket?: Ticket | null;
  loading?: boolean;
  scrollRequestKey?: number;
  onSelectTicket: (ticket: Ticket | null) => void;
}

const getHistoryStatusLabel = (ticket: Ticket) => {
  if (ticket.is_stolen) {
    return "S";
  }

  if (ticket.status === "pawned_picked_up") {
    return "P";
  }

  if (ticket.status === "pawned_expired" || ticket.status === "sold_expired") {
    return "E";
  }

  return "---";
};

const HistoryTicketsTable: React.FC<HistoryTicketsTableProps> = ({
  tickets,
  selectedTicket,
  loading = false,
  scrollRequestKey = 0,
  onSelectTicket,
}) => {
  const apiRef = useGridApiRef();
  const lastScrollTargetRef = React.useRef("");
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
        field: "status",
        headerName: "STATUS",
        width: 72,
        renderCell: (params) => (
          <CellTooltip
            value={getHistoryStatusLabel(params.row)}
            fallback="---"
          />
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
        field: "expire_date",
        headerName: "EXPDATE",
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
          <CellTooltip
            value={formatUppercase(params.value, "")}
            fallback="---"
          />
        ),
      },
    ],
    [],
  );

  React.useEffect(() => {
    if (!tickets.length) {
      return;
    }

    const selectedIndex = selectedTicket?.ticket_number
      ? tickets.findIndex(
          (ticket) => ticket.ticket_number === selectedTicket.ticket_number,
        )
      : -1;
    const targetIndex = selectedIndex >= 0 ? selectedIndex : tickets.length - 1;
    const scrollTargetKey = `${scrollRequestKey}:${targetIndex}`;

    if (lastScrollTargetRef.current === scrollTargetKey) {
      return;
    }

    lastScrollTargetRef.current = scrollTargetKey;

    const scrollToTarget = () => {
      apiRef.current.scrollToIndexes({ rowIndex: targetIndex });
    };

    const animationFrameId = window.requestAnimationFrame(scrollToTarget);
    const timeoutId = window.setTimeout(scrollToTarget, 80);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [apiRef, scrollRequestKey, selectedTicket?.ticket_number, tickets]);

  return (
    <DataGrid
      apiRef={apiRef}
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
