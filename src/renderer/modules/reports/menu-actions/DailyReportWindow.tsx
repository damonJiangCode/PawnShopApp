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
import { ticketApi } from "../../tickets/ticket.api";
import {
  formatCurrency,
  formatIsoDate,
} from "../../../shared/utils/formatters";
import WindowLayout from "../../../windows/WindowLayout";
import type { WindowScreenProps } from "../../../windows/windowRegistry";

const detailValue = (value: string | number | undefined) =>
  value === undefined || value === "" ? "---" : String(value);

const DailyReportWindow: React.FC<WindowScreenProps> = () => {
  const today = useMemo(() => formatIsoDate(new Date()), []);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [report, setReport] =
    useState<Awaited<ReturnType<typeof ticketApi.loadDailyReport>>>();
  const [missingTicketNumbers, setMissingTicketNumbers] = useState<number[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const hasReportTickets = Boolean(report?.tickets.length);

  const resetGeneratedReport = () => {
    setReport(undefined);
    setMissingTicketNumbers([]);
    setErrorMessage("");
  };

  const generateReport = async () => {
    if (!fromDate || !toDate) {
      setErrorMessage("Select both From and To dates.");
      return;
    }

    if (fromDate > toDate) {
      setErrorMessage("To date must be the same as or later than From date.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMissingTicketNumbers([]);

    try {
      const nextReport = await ticketApi.loadDailyReport({
        from_date: fromDate,
        to_date: toDate,
      });

      if (nextReport.missing_item_ticket_numbers.length) {
        setReport(undefined);
        setMissingTicketNumbers(nextReport.missing_item_ticket_numbers);
        return;
      }

      setReport(nextReport);
    } catch (error) {
      setReport(undefined);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to generate report.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <WindowLayout
      title="Daily Report"
      description="Generate detailed pawn and sold item records."
    >
      <GlobalStyles
        styles={{
          "@page": { margin: "8mm" },
          "@media print": {
            ".no-print": { display: "none !important" },
            "html, body, #root": {
              height: "auto !important",
              overflow: "visible !important",
            },
            body: { background: "#fff !important" },
          },
        }}
      />

      <Stack spacing={1.5} sx={{ minHeight: "100%" }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
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
              resetGeneratedReport();
            }}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 180 }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
              resetGeneratedReport();
            }}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 180 }}
          />
          <Button
            variant="contained"
            startIcon={
              loading ? <CircularProgress size={16} /> : <RefreshIcon />
            }
            disabled={loading}
            onClick={() => void generateReport()}
          >
            Generate
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            disabled={!hasReportTickets || loading}
            onClick={() => window.print()}
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

        {missingTicketNumbers.length ? (
          <Alert
            severity="warning"
            className="no-print"
            sx={{ displayPrint: "none" }}
          >
            Report not generated. Add at least one item to ticket(s):{" "}
            {missingTicketNumbers.join(", ")}.
          </Alert>
        ) : null}

        {report && !report.tickets.length ? (
          <Alert
            severity="info"
            className="no-print"
            sx={{ displayPrint: "none" }}
          >
            No pawn or sold tickets were found in this date range.
          </Alert>
        ) : null}

        {hasReportTickets && report ? (
          <Box sx={{ color: "#000", bgcolor: "#fff", px: 0.5 }}>
            <Stack alignItems="center" spacing={0.1} sx={{ mb: 0.75 }}>
              <Typography variant="h6" fontWeight={900}>
                DAILY REPORT
              </Typography>
              <Typography variant="caption" fontWeight={800}>
                FROM: {report.from_date} &nbsp;&nbsp; TO: {report.to_date}
                &nbsp;&nbsp; PRINT DATE: {today}
              </Typography>
            </Stack>

            <TableContainer>
              <Table
                size="small"
                aria-label="daily pawn and sold item report"
                sx={{
                  tableLayout: "fixed",
                  "& th, & td": {
                    px: 0.75,
                    py: 0.35,
                    fontSize: "0.72rem",
                    lineHeight: 1.25,
                    verticalAlign: "top",
                    overflowWrap: "anywhere",
                  },
                  "& thead": { displayPrint: "table-header-group" },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "14%", fontWeight: 900 }}>
                      No.
                    </TableCell>
                    <TableCell sx={{ width: "11%", fontWeight: 900 }}>
                      Amount / Qty
                    </TableCell>
                    <TableCell sx={{ width: "35%", fontWeight: 900 }}>
                      Customer / Description
                    </TableCell>
                    <TableCell sx={{ width: "40%", fontWeight: 900 }}>
                      Personal Data / Item Details
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.tickets.map((ticket) => (
                    <React.Fragment key={ticket.ticket_number}>
                      <TableRow
                        sx={{
                          breakInside: "avoid",
                          pageBreakInside: "avoid",
                          "& td": {
                            borderTop: "2px solid #444",
                            fontWeight: 700,
                          },
                        }}
                      >
                        <TableCell>
                          <strong>#{ticket.ticket_number}</strong>
                        </TableCell>
                        <TableCell>
                          <strong>{formatCurrency(ticket.amount)}</strong>
                        </TableCell>
                        <TableCell>
                          <strong>{detailValue(ticket.description)}</strong>
                          <br />
                          NAME: {ticket.client_name || "UNKNOWN CLIENT"}
                        </TableCell>
                        <TableCell>
                          DOB: {detailValue(ticket.date_of_birth)} | SEX:{" "}
                          {detailValue(ticket.gender)} | HAIR:{" "}
                          {detailValue(ticket.hair_color)} | EYES:{" "}
                          {detailValue(ticket.eye_color)}
                          <br />
                          HEIGHT: {detailValue(ticket.height_cm)} CM | WEIGHT:{" "}
                          {detailValue(ticket.weight_kg)} KG
                          <br />
                          ID: {detailValue(ticket.identifications)}
                        </TableCell>
                      </TableRow>

                      {ticket.items.map((item, itemIndex) => (
                        <TableRow
                          key={item.item_number}
                          sx={{
                            breakInside: "avoid",
                            pageBreakInside: "avoid",
                            "& td": { borderBottomColor: "#ddd" },
                          }}
                        >
                          <TableCell sx={{ pl: 4 }}>{itemIndex + 1}</TableCell>
                          <TableCell>
                            {formatCurrency(item.amount)} | QTY: {item.quantity}
                          </TableCell>
                          <TableCell>{detailValue(item.description)}</TableCell>
                          <TableCell>
                            MAKE: {detailValue(item.brand_name)} | MODEL:{" "}
                            {detailValue(item.model_number)} | SERIAL:{" "}
                            {detailValue(item.serial_number)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={3}
              sx={{ mt: 1.5, breakInside: "avoid" }}
            >
              <Typography fontWeight={800}>
                TICKETS: {report.total_tickets}
              </Typography>
              <Typography fontWeight={800}>
                ITEMS: {report.total_items}
              </Typography>
              <Typography fontWeight={900}>
                TOTAL: {formatCurrency(report.total_amount)}
              </Typography>
            </Stack>
          </Box>
        ) : !loading && !missingTicketNumbers.length && !errorMessage ? (
          <Typography color="text.secondary">
            Select a date range and generate the report.
          </Typography>
        ) : null}
      </Stack>
    </WindowLayout>
  );
};

export default DailyReportWindow;
