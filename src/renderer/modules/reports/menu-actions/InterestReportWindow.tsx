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
import React, { useMemo, useState } from "react";
import { INTEREST_REPORT_START_DATE } from "../../../../shared/reportSettings";
import { ticketApi } from "../../tickets/ticket.api";
import {
  formatIsoDate,
  formatIsoDateTime,
} from "../../../shared/utils/formatters";
import WindowLayout from "../../../windows/WindowLayout";
import type { WindowScreenProps } from "../../../windows/windowRegistry";
import ReportDocument from "../components/ReportDocument";

const InterestReportWindow: React.FC<WindowScreenProps> = () => {
  const today = useMemo(() => formatIsoDate(new Date()), []);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [report, setReport] =
    useState<Awaited<ReturnType<typeof ticketApi.loadInterestReport>>>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReport = async () => {
    if (!fromDate || !toDate) {
      setErrorMessage("Select both From and To dates.");
      return;
    }

    if (fromDate > toDate) {
      setErrorMessage("To date must be the same as or later than From date.");
      return;
    }

    if (
      fromDate < INTEREST_REPORT_START_DATE ||
      toDate < INTEREST_REPORT_START_DATE
    ) {
      setErrorMessage(
        `Interest reports are available from ${INTEREST_REPORT_START_DATE}.`,
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextReport = await ticketApi.loadInterestReport({
        from_date: fromDate,
        to_date: toDate,
      });
      setReport(nextReport);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load report.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const rows = report?.rows ?? [];
  const ticketCount = new Set(rows.map((row) => row.ticket_number)).size;

  return (
    <WindowLayout
      title="Interest Report"
      description="Generate interest payment records."
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
            label="From"
            type="date"
            size="small"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              setReport(undefined);
              setErrorMessage("");
            }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: INTEREST_REPORT_START_DATE },
            }}
            sx={{ width: { xs: "100%", sm: 180 } }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
              setReport(undefined);
              setErrorMessage("");
            }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: INTEREST_REPORT_START_DATE },
            }}
            sx={{ width: { xs: "100%", sm: 180 } }}
          />
          <Button
            variant="contained"
            startIcon={
              isLoading ? <CircularProgress size={16} /> : <RefreshIcon />
            }
            onClick={() => void loadReport()}
            disabled={isLoading || !fromDate || !toDate}
          >
            Generate
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            disabled={isLoading || !report}
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

        {report ? (
          <ReportDocument
            title="Interest Report"
            fromDate={report.from_date}
            toDate={report.to_date}
            footer={
              <>
                <Typography variant="body2" fontWeight={800}>
                  TICKETS: {ticketCount}
                </Typography>
                <Typography variant="body2" fontWeight={900}>
                  TOTAL: ${report.total_interest_paid.toFixed(2)}
                </Typography>
              </>
            }
          >
            <TableContainer>
              <Table size="small" aria-label="interest report">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "15%", fontWeight: 800 }}>
                      Ticket #
                    </TableCell>
                    <TableCell sx={{ width: "10%", fontWeight: 800 }}>
                      Months
                    </TableCell>
                    <TableCell sx={{ width: "12%", fontWeight: 800 }}>
                      Amount
                    </TableCell>
                    <TableCell sx={{ width: "25%", fontWeight: 800 }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ width: "20%", fontWeight: 800 }}>
                      Customer
                    </TableCell>
                    <TableCell sx={{ width: "18%", fontWeight: 800 }}>
                      Date & Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length ? (
                    rows.map((row) => (
                      <TableRow
                        key={`${row.ticket_number}-${row.payment_datetime}`}
                      >
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <span>{row.ticket_number}</span>
                          </Stack>
                        </TableCell>
                        <TableCell>{row.months_paid} x</TableCell>
                        <TableCell>${row.amount_paid.toFixed(2)}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.client_name}</TableCell>
                        <TableCell>
                          {formatIsoDateTime(row.payment_datetime)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No interest payments found for this date range.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </ReportDocument>
        ) : !isLoading && !errorMessage ? (
          <Typography color="text.secondary">
            Select a date range and generate the report.
          </Typography>
        ) : null}
      </Box>
    </WindowLayout>
  );
};

export default InterestReportWindow;
