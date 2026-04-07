import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridValueFormatter } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { Item } from "../../../shared/types/Item";

interface ItemsTableProps {
  items: Item[];
  selectedItem?: Item;
  onItemSelected: (i: Item) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ 
  items, 
  selectedItem, 
  onItemSelected 
}) => {
  const columns: GridColDef[] = [
    { field: "item_number", headerName: "ITM_NO", width: 120 },
    {
      field: "quantity",
      headerName: "QTY",
      width: 40,
      valueFormatter: ((params: any) =>
        params.value != null ? `${params.value}` : "") as GridValueFormatter,
    },
    { field: "description", headerName: "DESC", width: 300 },
    {
      field: "amount",
      headerName: "VALUE",
      width: 80,
      valueFormatter: ((params: any) =>
        params.value != null ? `$${params.value}` : "") as GridValueFormatter,
    },
    {
      field: "brand_name",
      headerName: "BRAND",
      width: 80,
      valueFormatter: ((params: any) =>
        params.value != null ? `${params.value}` : "") as GridValueFormatter,
    },
    {
      field: "model_number",
      headerName: "MODEL",
      width: 80,
      valueFormatter: ((params: any) =>
        params.value != null ? `${params.value}` : "") as GridValueFormatter,
    },
    {
      field: "serial_number",
      headerName: "SERIAL",
      width: 150,
      valueFormatter: ((params: any) =>
        params.value != null ? `${params.value}` : "") as GridValueFormatter,
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        columnHeaderHeight={34}
        rowHeight={30}
        rows={items}
        columns={columns}
        getRowId={(row) => row.item_number}
        rowSelectionModel={selectedItem?.item_number ? [selectedItem.item_number] : []}
        onRowClick={(params) => {
          const selectedItem = items.find((item) => item.item_number === params.id);
          if (selectedItem) onItemSelected(selectedItem);
        }}
        disableColumnMenu
        disableColumnSorting
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooter
        localeText={{
          noRowsLabel: "No items",
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

export default ItemsTable;
