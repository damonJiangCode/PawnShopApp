import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";
import type { Client } from "../../../../../shared/types/Client";

interface ClientTableProps {
  results: Client[];
  selectedClient?: Client | null;
  onSelect: (client: Client) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  results,
  selectedClient,
  onSelect,
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

  const rows = results.map((client, index) => ({
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
        rowHeight={24}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.client_number}
        rowSelectionModel={
          selectedClient?.client_number ? [selectedClient.client_number] : []
        }
        onRowClick={(params) => {
          const clickedClient =
            results.find((client) => client.client_number === params.id) ?? null;
          if (clickedClient) {
            onSelect(clickedClient);
          }
        }}
        disableColumnMenu
        disableColumnSorting
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableColumnResize
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
        sx={{
          border: "1px solid #ccc",
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
            py: 0,
            fontSize: 12,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-cellContent": {
            lineHeight: 1,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "2px solid #bbb",
          },
          "& .MuiDataGrid-columnHeader": {
            borderRight: "1px solid #ddd",
            backgroundColor: "#fafafa",
            py: 0,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.1,
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            height: "100%",
            alignItems: "center",
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

export default ClientTable;
