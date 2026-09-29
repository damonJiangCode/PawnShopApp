import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { Item } from "../../../../../shared/models/item.model";
import CellTooltip from "../../../../shared/components/CellTooltip";
import { formatDisplayValue } from "../../../../shared/utils/formatters";

export const getTransactionItemRowId = (row: Item): number | string =>
  row.draft_id ?? row.item_number;

export const transactionItemColumns: GridColDef[] = [
  {
    field: "item_number_display",
    headerName: "ITM_NO",
    width: 90,
    valueGetter: (_value, row: Item) =>
      row.source_item_number ?? row.item_number,
    renderCell: (params) => <CellTooltip value={params.value} />,
  },
  {
    field: "quantity",
    headerName: "QTY",
    width: 55,
    renderCell: (params) => (
      <CellTooltip value={formatDisplayValue(params.value, "")} />
    ),
  },
  {
    field: "description",
    headerName: "DESC",
    width: 200,
    renderCell: (params) => <CellTooltip value={params.value} />,
  },
  {
    field: "serial_number",
    headerName: "SERIAL",
    width: 80,
    renderCell: (params) => (
      <CellTooltip value={formatDisplayValue(params.value, "")} />
    ),
  },
  {
    field: "model_number",
    headerName: "MODEL",
    width: 80,
    renderCell: (params) => (
      <CellTooltip value={formatDisplayValue(params.value, "")} />
    ),
  },
  {
    field: "brand_name",
    headerName: "BRAND",
    width: 80,
    renderCell: (params) => (
      <CellTooltip value={formatDisplayValue(params.value, "")} />
    ),
  },
  {
    field: "amount",
    headerName: "VALUE",
    width: 80,
    renderCell: (params) => (
      <CellTooltip
        value={
          params.value != null && params.value !== "" ? `$${params.value}` : ""
        }
      />
    ),
  },
];

export const transactionItemsTableSx = {
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
};

interface TransactionItemsTableProps {
  items: Item[];
  selectedItem?: Item;
  onItemSelected: (i: Item) => void;
}

const TransactionItemsTable: React.FC<TransactionItemsTableProps> = ({
  items,
  selectedItem,
  onItemSelected,
}) => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        columnHeaderHeight={34}
        rowHeight={30}
        rows={items}
        columns={transactionItemColumns}
        getRowId={getTransactionItemRowId}
        rowSelectionModel={
          selectedItem ? [getTransactionItemRowId(selectedItem)] : []
        }
        onRowClick={(params) => {
          const selectedItem = items.find(
            (item) => getTransactionItemRowId(item) === params.id,
          );
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
        sx={transactionItemsTableSx}
      />
    </Box>
  );
};

export default TransactionItemsTable;
