import PrintIcon from "@mui/icons-material/Print";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  GlobalStyles,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ticketService } from "../../tickets/ticket.api";
import {
  formatCurrency,
  formatIsoDate,
  formatIsoDateTime,
} from "../../../shared/utils/formatters";
import MenuActionLayout from "../../../shared/menu-action/MenuActionLayout";
import type { MenuActionComponentProps } from "../../../app/menu-action/menuActionRegistry";

const BuybackReportWindow: React.FC<MenuActionComponentProps> = () => {
  const today = useMemo(() => formatIsoDate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [report, setReport] =
    useState<Awaited<ReturnType<typeof ticketService.loadBuybackReport>>>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReport = useCallback(async () => {
    if (!selectedDate) {
      setErrorMessage("Select a report date.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextReport = await ticketService.loadBuybackReport({
        date: selectedDate,
      });
      setReport(nextReport);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load report.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const rows = report?.rows ?? [];

  return (
    <MenuActionLayout
      title="Buyback Report"
      description="Generate daily pickup/buyback reconciliation."
    >
      <GlobalStyles
        styles={{
          "@media print": {
            ".no-print": {
              display: "none !important",
            },
            body: {
              background: "#fff !important",
            },
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minHeight: "100%",
          "@media print": {
            gap: 1.5,
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
          className="no-print"
          sx={{ displayPrint: "none" }}
        >
          <TextField
            label="Date"
            type="date"
            size="small"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: "100%", sm: 180 } }}
          />
          <Button
            variant="contained"
            startIcon={
              isLoading ? <CircularProgress size={16} /> : <RefreshIcon />
            }
            onClick={loadReport}
            disabled={isLoading}
          >
            Generate
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            disabled={isLoading}
          >
            Print / Save PDF
          </Button>
        </Stack>

        {errorMessage ? (
          <Alert
            severity="error"
            className="no-print"
            sx={{ displayPrint: "none" }}
          >
            {errorMessage}
          </Alert>
        ) : null}

        <Box
          sx={{
            color: "text.primary",
            bgcolor: "background.paper",
            "@media print": {
              color: "#000",
              bgcolor: "#fff",
            },
          }}
        >
          <Stack spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 0 }}>
              BUYBACK REPORT
            </Typography>
            <Typography variant="body2" fontWeight={800}>
              Date: {report?.date ?? selectedDate}
            </Typography>
          </Stack>

          <TableContainer>
            <Table size="small" aria-label="buyback report">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Ticket Number</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length ? (
                  rows.map((row) => (
                    <TableRow key={row.ticket_number}>
                      <TableCell>{row.ticket_number}</TableCell>
                      <TableCell>
                        {formatCurrency(row.pickup_amount_paid)}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.client_name}</TableCell>
                      <TableCell>
                        {formatIsoDateTime(row.pickup_datetime)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No buybacks found for this date.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Typography variant="subtitle1" fontWeight={900}>
              TOTAL BUYBACK PRICE
            </Typography>
            <Typography variant="subtitle1" fontWeight={900}>
              {formatCurrency(report?.total_buyback_price ?? 0)}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </MenuActionLayout>
  );
};

export default BuybackReportWindow;
