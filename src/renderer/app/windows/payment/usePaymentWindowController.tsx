import { useEffect, useMemo, useRef, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { Ticket } from "../../../../shared/types/Ticket";
import { calculation } from "../../../../shared/utils/calculation";
import CellTooltip from "../../../components/shared/CellTooltip";
import { ticketService } from "../../../services/ticketService";
import { formatCurrency } from "../../../utils/formatters";

export type PaymentMode = "pickup" | "extension";
export type PaymentStatusSeverity = "info" | "success" | "warning";

export type PaymentTicketRow = {
  id: number;
  ticketNumber: number;
  location: string;
  description: string;
  pickupAmount?: number;
  extensionAmount: number;
};

const mapTicketToPaymentRow = (ticket: Ticket): PaymentTicketRow | null => {
  if (!ticket.ticket_number) {
    return null;
  }

  const pawnAmount = Number(ticket.amount ?? 0);
  const oneTimeFee = Number(ticket.onetime_fee ?? 0);

  return {
    id: ticket.ticket_number,
    ticketNumber: ticket.ticket_number,
    location: ticket.location,
    description: ticket.description,
    pickupAmount: calculation.getPaymentPickupAmt(
      pawnAmount,
      oneTimeFee,
      ticket.transaction_datetime,
      ticket.interest_paid_months,
    ),
    extensionAmount: calculation.getBaseIntAmt(pawnAmount),
  };
};

export const usePaymentWindowController = () => {
  const params = new URLSearchParams(window.location.search);
  const ticketSearchInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<PaymentMode>("pickup");
  const [availableRows, setAvailableRows] = useState<PaymentTicketRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSeverity, setStatusSeverity] =
    useState<PaymentStatusSeverity>("info");
  const clientNumber = Number(params.get("clientNumber"));
  const clientLastName = params.get("clientLastName") || "";
  const clientFirstName = params.get("clientFirstName") || "";

  const columns = useMemo<GridColDef<PaymentTicketRow>[]>(
    () => [
      {
        field: "ticketNumber",
        headerName: "TICKET #",
        width: 92,
        renderCell: (params) => <CellTooltip value={params.value} />,
      },
      {
        field: "location",
        headerName: "LOC",
        width: 86,
        renderCell: (params) => <CellTooltip value={params.value} />,
      },
      {
        field: "description",
        headerName: "DESC",
        flex: 1,
        minWidth: 160,
        renderCell: (params) => <CellTooltip value={params.value} />,
      },
      ...(mode === "pickup"
        ? [
            {
              field: "pickupAmount",
              headerName: "PICKUP",
              width: 104,
              renderCell: (params) => (
                <CellTooltip value={formatCurrency(params.value)} />
              ),
            } satisfies GridColDef<PaymentTicketRow>,
          ]
        : []),
      {
        field: "extensionAmount",
        headerName: "EXT / 30",
        width: 112,
        renderCell: (params) => (
          <CellTooltip value={formatCurrency(params.value)} />
        ),
      },
    ],
    [mode],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ticketSearchInputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleLoad = async () => {
    if (!Number.isFinite(clientNumber) || clientNumber <= 0) {
      setStatusSeverity("warning");
      setStatusMessage("Select a client before loading payment tickets.");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setStatusSeverity("info");

    try {
      const tickets = await ticketService.loadTickets(clientNumber);
      const rows = tickets
        .filter((ticket) => ticket.status === "pawned")
        .map(mapTicketToPaymentRow)
        .filter((row): row is PaymentTicketRow => Boolean(row));

      setAvailableRows(rows);
      setStatusSeverity(rows.length ? "success" : "info");
      setStatusMessage(
        rows.length
          ? `${rows.length} pawned ticket(s) loaded.`
          : "No pawned tickets found.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      mode,
      availableRows,
      loading,
      statusMessage,
      statusSeverity,
      clientLastName,
      clientFirstName,
      columns,
      ticketSearchInputRef,
    },
    actions: {
      setMode,
      handleLoad,
    },
  };
};
