import React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import ClientBar from "../../../components/shared/ClientBar";
import { formatCurrency, formatIsoDate } from "../../../utils/formatters";
import {
  type PaymentMode,
  usePaymentWindowController,
} from "./usePaymentWindowController";

const modeStyles: Record<
  PaymentMode,
  { tableBackground: string; accent: string }
> = {
  pickup: {
    tableBackground: "#e3f2fd",
    accent: "#1976d2",
  },
  extension: {
    tableBackground: "#fff8e1",
    accent: "#f9a825",
  },
};
const summaryBackground = "#eaf3ff";

const paymentTableSx = {
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
};

const PaymentWindowApp: React.FC = () => {
  const { state, actions } = usePaymentWindowController();
  const {
    mode,
    availableRows,
    selectedRows,
    availableSelectionModel,
    selectedSelectionModel,
    loading,
    processing,
    statusMessage,
    statusSeverity,
    clientLastName,
    clientFirstName,
    columns,
    ticketSearchInputRef,
    ticketSearchValue,
    ticketSearchPreview,
    ticketSearchClientImage,
    ticketSearchDialogOpen,
    pickupSummaryAmount,
    extensionSummaryAmount,
    totalSummaryAmount,
  } = state;
  const selectedStyle = modeStyles[mode];

  const renderSummaryField = (
    label: string,
    value: string,
    backgroundColor = summaryBackground,
  ) => (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontWeight: 800 }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          mt: 0.35,
          px: 1,
          py: 0.65,
          borderRadius: 1,
          backgroundColor,
          border: "1px solid rgba(25, 118, 210, 0.22)",
          fontWeight: 900,
          minHeight: 35,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Box>
    </Box>
  );

  const renderTicketTable = (side: "available" | "selected") => (
    <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
      <DataGrid
        columnHeaderHeight={34}
        rowHeight={30}
        loading={loading}
        rows={side === "available" ? availableRows : selectedRows}
        columns={columns}
        getRowId={(row) => row.id}
        rowSelectionModel={
          side === "available"
            ? availableSelectionModel
            : selectedSelectionModel
        }
        onRowSelectionModelChange={
          side === "available"
            ? actions.setAvailableSelectionModel
            : actions.setSelectedSelectionModel
        }
        onRowClick={(params) => {
          const nextSelection = [params.id];
          if (side === "available") {
            actions.setAvailableSelectionModel(nextSelection);
          } else {
            actions.setSelectedSelectionModel(nextSelection);
          }
        }}
        getRowClassName={(params) =>
          mode === "pickup" && !params.row.isPickupAllowed
            ? "payment-row-hold"
            : ""
        }
        disableColumnMenu
        disableColumnSorting
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        hideFooter
        localeText={{
          noRowsLabel:
            side === "available"
              ? "Load or search tickets"
              : "Move tickets here",
        }}
        sx={{
          ...paymentTableSx,
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: selectedStyle.tableBackground,
          },
          "& .MuiDataGrid-row.payment-row-hold": {
            backgroundColor: "rgba(211, 47, 47, 0.18)",
          },
          "& .MuiDataGrid-row.payment-row-hold:hover": {
            backgroundColor: "rgba(211, 47, 47, 0.26)",
          },
          "& .MuiDataGrid-row.payment-row-hold.Mui-selected": {
            backgroundColor: "rgba(211, 47, 47, 0.32)",
          },
          "& .MuiDataGrid-row.payment-row-hold .MuiDataGrid-cell": {
            borderRight: "1px solid rgba(211, 47, 47, 0.35)",
            borderBottom: "1px solid rgba(211, 47, 47, 0.35)",
          },
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        height: "100vh",
        p: 1.5,
        boxSizing: "border-box",
        backgroundColor: "#f4f7fb",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 1.25,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          border: "1px solid rgba(25, 118, 210, 0.18)",
        }}
      >
        <ClientBar
          client_last_name={clientLastName}
          client_first_name={clientFirstName}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {renderSummaryField(
            "Pickup Amt",
            formatCurrency(pickupSummaryAmount),
          )}
          {renderSummaryField(
            "Extension Amt",
            formatCurrency(extensionSummaryAmount),
            modeStyles.extension.tableBackground,
          )}
          {renderSummaryField("Total Amt", formatCurrency(totalSummaryAmount))}
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          flex: 1,
          minHeight: 0,
          p: 1.25,
          borderRadius: 2,
          border: "1px solid rgba(25, 118, 210, 0.18)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => void actions.handleLoad()}
              disabled={loading}
            >
              Load
            </Button>
            <Button variant="outlined" onClick={actions.handleClear}>
              Clear
            </Button>
          </Box>

          <Tabs
            value={mode}
            onChange={(_event, nextMode) => actions.setMode(nextMode)}
            sx={{
              minHeight: 36,
              "& .MuiTab-root": {
                minHeight: 36,
                fontWeight: 900,
              },
              "& .Mui-selected": {
                color: selectedStyle.accent,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: selectedStyle.accent,
              },
            }}
          >
            <Tab value="pickup" label="Pickup" />
            <Tab value="extension" label="Extension" />
          </Tabs>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              inputRef={ticketSearchInputRef}
              label="Ticket #"
              size="small"
              value={ticketSearchValue}
              onChange={(event) =>
                actions.setTicketSearchValue(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void actions.handleTicketSearch();
                }
              }}
              sx={{ width: 160 }}
            />
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={() => void actions.handleTicketSearch()}
              disabled={loading}
            >
              Search
            </Button>
          </Box>
        </Box>

        {statusMessage && (
          <Alert
            severity={statusSeverity}
            variant={statusSeverity === "warning" ? "filled" : "outlined"}
            sx={{
              py: 0.25,
              alignItems: "center",
              fontWeight: statusSeverity === "warning" ? 800 : 600,
              "& .MuiAlert-message": {
                py: 0.5,
              },
            }}
          >
            {statusMessage}
          </Alert>
        )}

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "1fr 64px 1fr",
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0, minHeight: 0, display: "flex" }}>
            {renderTicketTable("available")}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {[
              { label: ">", onClick: actions.moveSelectedToSelected },
              { label: ">>", onClick: actions.moveAllToSelected },
              { label: "<<", onClick: actions.moveAllToAvailable },
              { label: "<", onClick: actions.moveSelectedToAvailable },
            ].map(({ label, onClick }) => (
              <Button
                key={label}
                variant="outlined"
                onClick={onClick}
                sx={{ minWidth: 48, fontWeight: 900 }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ minWidth: 0, minHeight: 0, display: "flex" }}>
            {renderTicketTable("selected")}
          </Box>
        </Box>

        <Dialog
          open={ticketSearchDialogOpen}
          onClose={actions.closeTicketSearchDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Ticket Owner Check</DialogTitle>
          <DialogContent dividers>
            {ticketSearchPreview && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    src={ticketSearchClientImage ?? undefined}
                    variant="rounded"
                    sx={{ width: 140, height: 140, border: "1px solid #ccc" }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {(ticketSearchPreview.client.pickup_self_only ||
                    ticketSearchPreview.ticket.is_lost) && (
                    <Alert severity="warning" variant="filled">
                      {[
                        ticketSearchPreview.client.pickup_self_only
                          ? "Only this client can pick up."
                          : "",
                        ticketSearchPreview.ticket.is_lost
                          ? "This ticket is marked as lost."
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </Alert>
                  )}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography sx={{ fontWeight: 900 }}>
                        {ticketSearchPreview.client.last_name.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography sx={{ fontWeight: 900 }}>
                        {ticketSearchPreview.client.first_name.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Middle Name
                      </Typography>
                      <Typography sx={{ fontWeight: 900 }}>
                        {ticketSearchPreview.client.middle_name?.toUpperCase() ||
                          "---"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        DOB
                      </Typography>
                      <Typography sx={{ fontWeight: 900 }}>
                        {formatIsoDate(
                          ticketSearchPreview.client.date_of_birth,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Notes
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        minHeight: 96,
                        maxHeight: 160,
                        overflow: "auto",
                        p: 1,
                        border: "1px solid #d0d7de",
                        borderRadius: 1,
                        whiteSpace: "pre-wrap",
                        backgroundColor: "#fff",
                        fontWeight: ticketSearchPreview.client.notes
                          ? 700
                          : 400,
                      }}
                    >
                      {ticketSearchPreview.client.notes || "No notes."}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={actions.addTicketSearchPreviewToAvailable}
            >
              Confirm
            </Button>
            <Button onClick={actions.closeTicketSearchDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => void actions.handleDone()}
            disabled={loading || processing}
          >
            Done
          </Button>
          <Button variant="outlined" onClick={() => window.close()}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentWindowApp;
