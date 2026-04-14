import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";
import type { Client } from "../../../../shared/types/Client";

interface ClientsTableProps {
  clients: Client[];
  selectedClient?: Client | null;
  onClientSelect: (c: Client) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  selectedClient,
  onClientSelect,
}) => {
  const formatDob = (value?: string | Date | null) => {
    if (!value) {
      return "";
    }

    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return String(value);
    }

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const rows = clients.map((client, index) => ({
    ...client,
    row_index: index + 1,
    last_name_display: client.last_name?.toUpperCase() ?? "",
    first_name_display: client.first_name?.toUpperCase() ?? "",
    date_of_birth_display: formatDob(client.date_of_birth),
  }));

  const renderWithTooltip = (value?: string) => (
    <Tooltip title={value || ""} arrow>
      <Box
        component="span"
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {value || ""}
      </Box>
    </Tooltip>
  );

  const columns: GridColDef[] = [
    { field: "row_index", headerName: "#", width: 96 },
    {
      field: "last_name_display",
      headerName: "LAST NAME",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => renderWithTooltip(params.value),
    },
    {
      field: "first_name_display",
      headerName: "FIRST NAME",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => renderWithTooltip(params.value),
    },
    {
      field: "date_of_birth_display",
      headerName: "DATE OF BIRTH",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => renderWithTooltip(params.value),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        columnHeaderHeight={34}
        rowHeight={30}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.client_number}
        rowSelectionModel={selectedClient?.client_number ? [selectedClient.client_number] : []}
        onRowClick={(params) => {
          const selectedClient = clients.find((client) => client.client_number === params.id);
          if (selectedClient) onClientSelect(selectedClient);
        }}
        disableColumnMenu
        disableColumnSorting
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooter
        localeText={{
          noRowsLabel: "No clients",
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

export default ClientsTable;
