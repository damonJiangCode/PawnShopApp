import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridValueFormatter } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { Item } from "../../../../shared/types/Item";

interface ItemTableProps {
  items: Item[];
  selectedItem?: Item;
  onItemSelected: (i: Item) => void;
}

const ItemTable: React.FC<ItemTableProps> = (props) => {
  const { items, onItemSelected } = props;

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
    <Box sx={{ height: 150, width: "100%" }}>
      <DataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row.item_number}
        onRowClick={(params) => {
          const selectedItem = items.find((item) => item.item_number === params.id);
          if (selectedItem) onItemSelected(selectedItem);
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
    </Box>
  );
};

export default ItemTable;
