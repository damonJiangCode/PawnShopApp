import React from "react";
import {
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import ClientBar from "../../../components/shared/ClientBar";
import { formatCurrency } from "../../../utils/formatters";
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
    loading,
    statusMessage,
    clientLastName,
    clientFirstName,
    columns,
    ticketSearchInputRef,
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
        rows={side === "available" ? availableRows : []}
        columns={columns}
        getRowId={(row) => row.id}
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
          {renderSummaryField("Pickup Amt", formatCurrency(0))}
          {renderSummaryField(
            "Extension Amt",
            formatCurrency(0),
            modeStyles.extension.tableBackground,
          )}
          {renderSummaryField("Total Amt", formatCurrency(0))}
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
            <Button variant="outlined">Clear</Button>
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
              sx={{ width: 160 }}
            />
            <Button variant="outlined" startIcon={<SearchIcon />}>
              Search
            </Button>
          </Box>
        </Box>

        {statusMessage && (
          <Typography variant="body2" color="text.secondary">
            {statusMessage}
          </Typography>
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
            {[">", ">>", "<<", "<"].map((label) => (
              <Button
                key={label}
                variant="outlined"
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="contained">Done</Button>
          <Button variant="outlined" onClick={() => window.close()}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentWindowApp;
