import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { ItemLoadWindowPayload } from "../../shared/types/windowPayload";
import TransactionItemImage from "../components/transaction/items/TransactionItemImage";
import {
  getTransactionItemRowId,
  transactionItemColumns,
  transactionItemsTableSx,
} from "../components/transaction/items/TransactionItemsTable";
import { windowService } from "../services/windowService";

const ItemLoadWindowApp: React.FC = () => {
  const requestId = useMemo(() => {
    return new URLSearchParams(window.location.search).get("requestId") ?? "";
  }, []);
  const [payload, setPayload] = useState<ItemLoadWindowPayload | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [previewItemId, setPreviewItemId] = useState<number | string | null>(null);
  const [error, setError] = useState("");
  const previewItem =
    payload?.items.find((item) => String(getTransactionItemRowId(item)) === String(previewItemId)) ??
    payload?.items[0];

  useEffect(() => {
    let active = true;

    const loadPayload = async () => {
      if (!requestId) {
        setError("Missing window request.");
        return;
      }

      const nextPayload = await windowService.loadItemLoadWindowPayload(requestId);

      if (!active) {
        return;
      }

      if (!nextPayload) {
        setError("This load window is no longer available.");
        return;
      }

      setPayload(nextPayload);
      setSelectionModel(nextPayload.items.map(getTransactionItemRowId));
      setPreviewItemId(
        nextPayload.items[0] ? getTransactionItemRowId(nextPayload.items[0]) : null,
      );
      document.title = nextPayload.title;
    };

    void loadPayload();

    return () => {
      active = false;
    };
  }, [requestId]);

  const handleSubmit = async () => {
    if (!requestId) {
      return;
    }

    await windowService.submitItemLoadWindow(requestId, [...selectionModel]);
  };

  const handleCancel = async () => {
    if (!requestId) {
      window.close();
      return;
    }

    await windowService.cancelItemLoadWindow(requestId);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        p: 1.5,
        boxSizing: "border-box",
        backgroundColor: "#eef4ff",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "#f8fafc",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {payload?.title ?? "Load Items"}
          </Typography>
          {payload?.description && (
            <Typography variant="body2" color="text.secondary">
              {payload.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, p: 1.5 }}>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : !payload ? (
            <Typography variant="body2" color="text.secondary">
              Loading items...
            </Typography>
          ) : !payload.items.length ? (
            <Alert severity="info">This ticket does not have any items.</Alert>
          ) : (
            <Box
              sx={{
                height: "100%",
                minHeight: 0,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 240px",
                gap: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0, minHeight: 0 }}>
                <DataGrid
                  columnHeaderHeight={34}
                  rowHeight={30}
                  rows={payload.items}
                  columns={transactionItemColumns}
                  getRowId={getTransactionItemRowId}
                  checkboxSelection
                  disableRowSelectionOnClick
                  rowSelectionModel={selectionModel}
                  onRowSelectionModelChange={setSelectionModel}
                  onRowClick={(params) => setPreviewItemId(params.id)}
                  disableColumnMenu
                  disableColumnFilter
                  disableColumnSelector
                  disableDensitySelector
                  hideFooter
                  localeText={{ noRowsLabel: "No items" }}
                  sx={transactionItemsTableSx}
                />
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={700}>
                  Item Image
                </Typography>
                <TransactionItemImage selectedItem={previewItem} />
                {previewItem && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    #{previewItem.source_item_number ?? previewItem.item_number}{" "}
                    {previewItem.description}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!payload?.items.length || !selectionModel.length}
          >
            {payload?.actionLabel ?? "Add to Ticket"}
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ItemLoadWindowApp;
