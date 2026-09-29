import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { Client } from "../../../../../shared/models/client.model";
import CellTooltip from "../../../../shared/components/CellTooltip";
import {
  formatShortDate,
  formatUppercase,
} from "../../../../shared/utils/formatters";

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
  const rows = clients.map((client, index) => ({
    ...client,
    row_index: index + 1,
    last_name_display: formatUppercase(client.last_name, ""),
    first_name_display: formatUppercase(client.first_name, ""),
    gender_display: formatUppercase(client.gender, ""),
    date_of_birth_display: formatShortDate(client.date_of_birth),
  }));

  const columns: GridColDef[] = [
    { field: "row_index", headerName: "#", width: 96 },
    {
      field: "last_name_display",
      headerName: "LAST NAME",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => <CellTooltip value={params.value} />,
    },
    {
      field: "first_name_display",
      headerName: "FIRST NAME",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => <CellTooltip value={params.value} />,
    },
    {
      field: "gender_display",
      headerName: "GENDER",
      width: 110,
      renderCell: (params) => <CellTooltip value={params.value} />,
    },
    {
      field: "date_of_birth_display",
      headerName: "DATE OF BIRTH",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => <CellTooltip value={params.value} />,
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
        rowSelectionModel={
          selectedClient?.client_number ? [selectedClient.client_number] : []
        }
        onRowClick={(params) => {
          const selectedClient = clients.find(
            (client) => client.client_number === params.id,
          );
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
          borderColor: "divider",
          "& .MuiDataGrid-cell": {
            borderRightColor: "divider",
            borderBottomColor: "divider",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottomColor: "divider",
          },
          "& .MuiDataGrid-columnHeader": {
            borderRightColor: "divider",
            backgroundColor: "action.hover",
            py: 0,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "action.hover",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "action.selected",
          },
          "& .MuiDataGrid-row.Mui-selected:hover": {
            backgroundColor: "action.focus",
          },
          "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
            borderRightColor: "divider",
            borderBottomColor: "divider",
          },
        }}
      />
    </Box>
  );
};

export default ClientsTable;
