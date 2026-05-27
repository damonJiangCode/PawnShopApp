import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";
import type { TicketSearchResult } from "../../../../../shared/types/ticketPayload";
import type { TicketFormError } from "../../../../services/ticketService";
import { ticketService } from "../../../../services/ticketService";
import {
  formatCurrency,
  formatIsoDate,
  formatUppercase,
} from "../../../../utils/formatters";

const TicketStolenWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => {
  const ticketInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const [ticketNumber, setTicketNumber] = React.useState("");
  const [employeePassword, setEmployeePassword] = React.useState("");
  const [searchResult, setSearchResult] =
    React.useState<TicketSearchResult | null>(null);
  const [stolenTickets, setStolenTickets] = React.useState<
    TicketSearchResult[]
  >([]);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [marking, setMarking] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ticketInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleSearch = async () => {
    const normalizedTicketNumber = Number(ticketNumber);

    if (
      !Number.isFinite(normalizedTicketNumber) ||
      normalizedTicketNumber <= 0
    ) {
      setError("Enter a valid ticket number.");
      return;
    }

    setSearching(true);
    setError("");
    setMessage("");
    setSearchResult(null);

    try {
      const result = await ticketService.searchTicket(normalizedTicketNumber);

      if (!result) {
        setError("No ticket was found for that number.");
        return;
      }

      setSearchResult(result);
      setEmployeePassword("");
      requestAnimationFrame(() => {
        passwordInputRef.current?.focus();
      });
    } catch (err) {
      console.error(err);
      setError("Unable to search ticket right now.");
    } finally {
      setSearching(false);
    }
  };

  const handleMarkStolen = async () => {
    if (!searchResult?.ticket.ticket_number) {
      setError("Search a ticket before marking it stolen.");
      return;
    }

    if (!employeePassword.trim()) {
      setError("Enter employee password.");
      passwordInputRef.current?.focus();
      return;
    }

    setMarking(true);
    setError("");
    setMessage("");

    try {
      const stolenTicket = await ticketService.markTicketStolen({
        ticket_number: searchResult.ticket.ticket_number,
        employee_password: employeePassword,
      });
      const stolenResult = {
        ...searchResult,
        ticket: stolenTicket,
      };

      setStolenTickets((prev) => [stolenResult, ...prev]);
      setSearchResult(null);
      setTicketNumber("");
      setEmployeePassword("");
      setMessage(`Ticket #${stolenTicket.ticket_number} marked stolen.`);

      const channel = new BroadcastChannel("menu-events");
      channel.postMessage({
        type: "ticket-stolen",
        ticket: stolenTicket,
        client: searchResult.client,
      });
      channel.close();

      requestAnimationFrame(() => {
        ticketInputRef.current?.focus();
      });
    } catch (err) {
      console.error(err);
      const formError = err as TicketFormError;
      setError(formError.message || "Unable to mark ticket stolen right now.");
    } finally {
      setMarking(false);
    }
  };

  return (
    <MenuActionPlaceholder
      actionId={actionId}
      title="Mark Ticket Stolen"
      description="Search a ticket, confirm the details, then mark it stolen."
    >
      <Stack spacing={1.5} sx={{ height: "100%" }}>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSearch();
          }}
          sx={{ pt: 0.5 }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              inputRef={ticketInputRef}
              size="small"
              label="Ticket Number"
              value={ticketNumber}
              onChange={(event) => {
                setTicketNumber(event.target.value.replace(/\D/g, ""));
                setError("");
              }}
              inputProps={{ inputMode: "numeric" }}
              sx={{ width: 220 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={searching}
              sx={{ minWidth: 96 }}
            >
              Search
            </Button>
          </Stack>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

        {searchResult && (
          <Paper variant="outlined" sx={{ p: 1.25 }}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={800}>
                  Ticket #{searchResult.ticket.ticket_number}
                </Typography>
                <Chip
                  size="small"
                  color={searchResult.ticket.is_stolen ? "error" : "default"}
                  label={
                    searchResult.ticket.is_stolen ? "STOLEN" : "NOT STOLEN"
                  }
                />
              </Stack>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1,
                }}
              >
                <TextField
                  size="small"
                  label="Client"
                  value={`${formatUppercase(searchResult.client.last_name)}, ${formatUppercase(searchResult.client.first_name)}`}
                  disabled
                />
                <TextField
                  size="small"
                  label="Status"
                  value={formatUppercase(searchResult.ticket.status)}
                  disabled
                />
                <TextField
                  size="small"
                  label="Due Date"
                  value={formatIsoDate(searchResult.ticket.due_date)}
                  disabled
                />
                <TextField
                  size="small"
                  label="Amount"
                  value={formatCurrency(searchResult.ticket.amount)}
                  disabled
                />
              </Box>
              <TextField
                size="small"
                label="Description"
                value={searchResult.ticket.description}
                disabled
                fullWidth
              />
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  inputRef={passwordInputRef}
                  size="small"
                  type="password"
                  label="Employee Password"
                  value={employeePassword}
                  onChange={(event) => {
                    setEmployeePassword(event.target.value);
                    setError("");
                  }}
                  sx={{ width: 240 }}
                />
                <Button
                  variant="contained"
                  color="error"
                  disabled={marking}
                  onClick={() => void handleMarkStolen()}
                  sx={{ minWidth: 128 }}
                >
                  Mark Stolen
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        <Paper
          variant="outlined"
          sx={{ flex: 1, minHeight: 0, overflow: "auto" }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Ticket</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stolenTickets.length ? (
                stolenTickets.map(({ client, ticket }) => (
                  <TableRow key={ticket.ticket_number}>
                    <TableCell>{ticket.ticket_number}</TableCell>
                    <TableCell>
                      {formatUppercase(client.last_name)},{" "}
                      {formatUppercase(client.first_name)}
                    </TableCell>
                    <TableCell>{formatUppercase(ticket.status)}</TableCell>
                    <TableCell>{formatIsoDate(ticket.due_date)}</TableCell>
                    <TableCell>{formatCurrency(ticket.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary" variant="body2">
                      Stolen tickets will appear here.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </MenuActionPlaceholder>
  );
};

export default TicketStolenWindow;
