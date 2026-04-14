import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { Item } from "../../../../shared/types/Item";

interface TicketItemLoadDialogProps {
  open: boolean;
  title: string;
  description?: string;
  actionLabel: string;
  items: Item[];
  onClose: () => void;
  onConfirm: (items: Item[]) => void;
}

const TicketItemLoadDialog: React.FC<TicketItemLoadDialogProps> = ({
  open,
  title,
  description = "",
  actionLabel,
  items,
  onClose,
  onConfirm,
}) => {
  const itemIds = useMemo(
    () => items.map((item) => item.draft_id ?? item.item_number),
    [items],
  );
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectionModel(itemIds);
  }, [itemIds, open]);

  const columns: GridColDef[] = [
    {
      field: "item_number_display",
      headerName: "ITM_NO",
      width: 110,
      valueGetter: (_value, row: Item) => row.source_item_number ?? row.item_number,
    },
    { field: "quantity", headerName: "QTY", width: 70 },
    { field: "description", headerName: "DESC", width: 260 },
    { field: "brand_name", headerName: "BRAND", width: 120 },
    { field: "model_number", headerName: "MODEL", width: 120 },
    { field: "serial_number", headerName: "SERIAL", width: 170 },
    {
      field: "amount",
      headerName: "VALUE",
      width: 100,
      valueFormatter: (params: { value?: number | null }) =>
        typeof params.value === "number" ? `$${params.value.toFixed(2)}` : "",
    },
  ];

  const handleConfirm = () => {
    const selectedItems = items.filter((item) =>
      selectionModel.includes(item.draft_id ?? item.item_number),
    );

    onConfirm(selectedItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}

          {!items.length ? (
            <Alert severity="info">This ticket does not have any items.</Alert>
          ) : (
            <Box sx={{ height: 360, width: "100%" }}>
              <DataGrid
                rows={items}
                columns={columns}
                getRowId={(row) => row.draft_id ?? row.item_number}
                checkboxSelection
                disableRowSelectionOnClick
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={(nextModel) =>
                  setSelectionModel(nextModel)
                }
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                hideFooter
                localeText={{ noRowsLabel: "No items" }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectionModel.length || !items.length}
        >
          {actionLabel}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketItemLoadDialog;
