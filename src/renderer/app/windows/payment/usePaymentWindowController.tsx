import { useEffect, useMemo, useRef, useState } from "react";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { Ticket } from "../../../../shared/types/Ticket";
import { calculation } from "../../../../shared/utils/calculation";
import CellTooltip from "../../../components/shared/CellTooltip";
import { ticketService } from "../../../services/ticketService";
import { formatCurrency, formatIsoDate } from "../../../utils/formatters";

export type PaymentMode = "pickup" | "extension";
export type PaymentStatusSeverity = "info" | "success" | "warning";

export type PaymentTicketRow = {
  id: number;
  ticketNumber: number;
  location: string;
  description: string;
  pickupAmount?: number;
  extensionAmount: number;
  isPickupAllowed: boolean;
  earliestPickupDate: Date;
};

type PaymentRowsByMode = Record<PaymentMode, PaymentTicketRow[]>;
type PaymentSelectionByMode = Record<PaymentMode, GridRowSelectionModel>;

const createEmptyRowsByMode = (): PaymentRowsByMode => ({
  pickup: [],
  extension: [],
});

const createEmptySelectionByMode = (): PaymentSelectionByMode => ({
  pickup: [],
  extension: [],
});

const getOppositeMode = (mode: PaymentMode): PaymentMode =>
  mode === "pickup" ? "extension" : "pickup";

const mapTicketToPaymentRow = (
  ticket: Ticket,
  holidayDateKeys: string[],
): PaymentTicketRow | null => {
  if (!ticket.ticket_number) {
    return null;
  }

  const pawnAmount = Number(ticket.amount ?? 0);
  const oneTimeFee = Number(ticket.onetime_fee ?? 0);
  const earliestPickupDate = calculation.getEarliestPickupDatetime(
    ticket.transaction_datetime,
    holidayDateKeys,
  );

  return {
    id: ticket.ticket_number,
    ticketNumber: ticket.ticket_number,
    location: ticket.location,
    description: ticket.description,
    isPickupAllowed: calculation.isPickupAllowed(
      ticket.transaction_datetime,
      holidayDateKeys,
    ),
    earliestPickupDate,
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
  const [availableRowsByMode, setAvailableRowsByMode] =
    useState<PaymentRowsByMode>(createEmptyRowsByMode);
  const [selectedRowsByMode, setSelectedRowsByMode] =
    useState<PaymentRowsByMode>(createEmptyRowsByMode);
  const [availableSelectionByMode, setAvailableSelectionByMode] =
    useState<PaymentSelectionByMode>(createEmptySelectionByMode);
  const [selectedSelectionByMode, setSelectedSelectionByMode] =
    useState<PaymentSelectionByMode>(createEmptySelectionByMode);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusSeverity, setStatusSeverity] =
    useState<PaymentStatusSeverity>("info");
  const clientNumber = Number(params.get("clientNumber"));
  const clientLastName = params.get("clientLastName") || "";
  const clientFirstName = params.get("clientFirstName") || "";
  const availableRows = availableRowsByMode[mode];
  const selectedRows = selectedRowsByMode[mode];
  const availableSelectionModel = availableSelectionByMode[mode];
  const selectedSelectionModel = selectedSelectionByMode[mode];
  const pickupSummaryAmount = selectedRowsByMode.pickup.reduce(
    (sum, row) => sum + Number(row.pickupAmount ?? 0),
    0,
  );
  const extensionSummaryAmount = selectedRowsByMode.extension.reduce(
    (sum, row) => sum + row.extensionAmount,
    0,
  );
  const totalSummaryAmount = pickupSummaryAmount + extensionSummaryAmount;

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
      const [tickets, holidays] = await Promise.all([
        ticketService.loadTickets(clientNumber),
        ticketService.loadHolidayDates(),
      ]);
      const holidayDateKeys = holidays.map((holiday) => holiday.holiday_date);
      const oppositeSelectedIds = new Set(
        selectedRowsByMode[getOppositeMode(mode)].map((row) => row.id),
      );
      const currentSelectedIds = new Set(
        selectedRowsByMode[mode].map((row) => row.id),
      );
      const rows = tickets
        .filter((ticket) => ticket.status === "pawned")
        .map((ticket) => mapTicketToPaymentRow(ticket, holidayDateKeys))
        .filter((row): row is PaymentTicketRow => Boolean(row))
        .filter(
          (row) =>
            !currentSelectedIds.has(row.id) && !oppositeSelectedIds.has(row.id),
        );

      setAvailableRowsByMode((prev) => ({ ...prev, [mode]: rows }));
      setAvailableSelectionByMode((prev) => ({ ...prev, [mode]: [] }));
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

  const confirmBlockedPickupRows = (rows: PaymentTicketRow[]) => {
    if (mode !== "pickup") {
      return true;
    }

    const blockedRows = rows.filter((row) => !row.isPickupAllowed);

    if (!blockedRows.length) {
      return true;
    }

    const ticketLines = blockedRows
      .map(
        (row) =>
          `Ticket #${row.ticketNumber}: earliest pickup ${formatIsoDate(
            row.earliestPickupDate,
          )}`,
      )
      .join("\n");

    return window.confirm(`${ticketLines}`);
  };

  const moveRowsToSelected = (moveAll: boolean) => {
    const selectedIds = new Set(
      moveAll
        ? availableRows.map((row) => row.id)
        : availableSelectionModel.map(Number),
    );
    const rowsToMove = availableRows.filter((row) => selectedIds.has(row.id));

    if (!rowsToMove.length || !confirmBlockedPickupRows(rowsToMove)) {
      return;
    }

    setSelectedRowsByMode((prev) => ({
      ...prev,
      [mode]: [...prev[mode], ...rowsToMove],
    }));
    setAvailableRowsByMode((prev) => ({
      ...prev,
      [mode]: prev[mode].filter((row) => !selectedIds.has(row.id)),
    }));
    setAvailableSelectionByMode((prev) => ({ ...prev, [mode]: [] }));
  };

  const moveRowsToAvailable = (moveAll: boolean) => {
    const selectedIds = new Set(
      moveAll
        ? selectedRows.map((row) => row.id)
        : selectedSelectionModel.map(Number),
    );
    const rowsToMove = selectedRows.filter((row) => selectedIds.has(row.id));

    if (!rowsToMove.length) {
      return;
    }

    setAvailableRowsByMode((prev) => ({
      ...prev,
      [mode]: [...prev[mode], ...rowsToMove].sort(
        (a, b) => a.ticketNumber - b.ticketNumber,
      ),
    }));
    setSelectedRowsByMode((prev) => ({
      ...prev,
      [mode]: prev[mode].filter((row) => !selectedIds.has(row.id)),
    }));
    setSelectedSelectionByMode((prev) => ({ ...prev, [mode]: [] }));
  };

  const handleClear = () => {
    setAvailableRowsByMode((prev) => ({ ...prev, [mode]: [] }));
    setSelectedRowsByMode((prev) => ({ ...prev, [mode]: [] }));
    setAvailableSelectionByMode((prev) => ({ ...prev, [mode]: [] }));
    setSelectedSelectionByMode((prev) => ({ ...prev, [mode]: [] }));
    setStatusMessage("");
  };

  const handleDone = async () => {
    const pickupRows = selectedRowsByMode.pickup;

    if (!pickupRows.length) {
      setStatusSeverity("warning");
      setStatusMessage("Move pickup ticket(s) to the right table first.");
      return;
    }

    setProcessing(true);
    setStatusSeverity("info");
    setStatusMessage("");

    try {
      const pickedUpTickets = await ticketService.pickupTickets({
        ticket_numbers: pickupRows.map((row) => row.ticketNumber),
      });
      const pickedUpIds = new Set(
        pickedUpTickets
          .map((ticket) => ticket.ticket_number)
          .filter((ticketNumber): ticketNumber is number =>
            Number.isFinite(ticketNumber),
          ),
      );

      setSelectedRowsByMode((prev) => ({
        ...prev,
        pickup: prev.pickup.filter((row) => !pickedUpIds.has(row.ticketNumber)),
        extension: prev.extension.filter(
          (row) => !pickedUpIds.has(row.ticketNumber),
        ),
      }));
      setAvailableRowsByMode((prev) => ({
        ...prev,
        pickup: prev.pickup.filter((row) => !pickedUpIds.has(row.ticketNumber)),
        extension: prev.extension.filter(
          (row) => !pickedUpIds.has(row.ticketNumber),
        ),
      }));
      setAvailableSelectionByMode(createEmptySelectionByMode());
      setSelectedSelectionByMode(createEmptySelectionByMode());
      setStatusSeverity("success");
      setStatusMessage(
        `${pickedUpTickets.length} ticket(s) picked up successfully.`,
      );
    } catch (err) {
      console.error(err);
      setStatusSeverity("warning");
      setStatusMessage(
        err instanceof Error ? err.message : "Unable to pickup ticket(s).",
      );
    } finally {
      setProcessing(false);
    }
  };

  return {
    state: {
      mode,
      availableRows,
      selectedRows,
      availableSelectionModel,
      selectedSelectionModel,
      loading: loading || processing,
      processing,
      statusMessage,
      statusSeverity,
      clientLastName,
      clientFirstName,
      columns,
      ticketSearchInputRef,
      pickupSummaryAmount,
      extensionSummaryAmount,
      totalSummaryAmount,
    },
    actions: {
      setMode,
      handleLoad,
      handleClear,
      handleDone,
      setAvailableSelectionModel: (selectionModel: GridRowSelectionModel) =>
        setAvailableSelectionByMode((prev) => ({
          ...prev,
          [mode]: selectionModel,
        })),
      setSelectedSelectionModel: (selectionModel: GridRowSelectionModel) =>
        setSelectedSelectionByMode((prev) => ({
          ...prev,
          [mode]: selectionModel,
        })),
      moveSelectedToSelected: () => moveRowsToSelected(false),
      moveAllToSelected: () => moveRowsToSelected(true),
      moveSelectedToAvailable: () => moveRowsToAvailable(false),
      moveAllToAvailable: () => moveRowsToAvailable(true),
    },
  };
};
