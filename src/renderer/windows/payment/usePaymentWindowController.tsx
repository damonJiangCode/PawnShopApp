import { useEffect, useMemo, useRef, useState } from "react";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { Ticket } from "../../../shared/types/Ticket";
import type { TicketSearchResult } from "../../../shared/types/ticketApiTypes";
import { calculation } from "../../../shared/utils/calculation";
import CellTooltip from "../../components/shared/CellTooltip";
import { clientService } from "../../services/clientService";
import { ticketService } from "../../services/ticketService";
import { formatCurrency, formatIsoDate } from "../../utils/formatters";

export type PaymentMode = "pickup" | "extension";
export type PaymentStatusSeverity = "info" | "success" | "warning";

export type PaymentTicketRow = {
  id: number | string;
  ticketNumber: number;
  status: Ticket["status"];
  location: string;
  description: string;
  dueDate: Date;
  sourceDueDate: Date;
  pickupAmount?: number;
  baseExtensionAmount: number;
  extensionAmount: number;
  extensionMonths: number;
  isPickupAllowed: boolean;
  earliestPickupDate: Date;
};

type PaymentRowsByMode = Record<PaymentMode, PaymentTicketRow[]>;
type PaymentSelectionByMode = Record<PaymentMode, GridRowSelectionModel>;

type PaymentCompletedEvent = {
  type: "payment-completed";
  clientNumber: number;
  pickedUpCount: number;
};

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

const addThirtyDayPeriods = (date: Date, periods: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + periods * 30);
  return nextDate;
};

const mapTicketToPaymentRow = (
  ticket: Ticket,
  holidayDateKeys: string[],
): PaymentTicketRow | null => {
  if (!ticket.ticket_number) {
    return null;
  }

  const pawnAmount = Number(ticket.amount ?? 0);
  const oneTimeFee = Number(ticket.onetime_fee ?? 0);
  const baseExtensionAmount = calculation.getBaseIntAmt(pawnAmount);
  const earliestPickupDate = calculation.getEarliestPickupDatetime(
    ticket.transaction_datetime,
    holidayDateKeys,
  );

  return {
    id: ticket.ticket_number,
    ticketNumber: ticket.ticket_number,
    status: ticket.status,
    location: ticket.location,
    description: ticket.description,
    dueDate: ticket.due_date,
    sourceDueDate: ticket.due_date,
    isPickupAllowed: calculation.isPickupAllowed(
      ticket.transaction_datetime,
      holidayDateKeys,
    ),
    earliestPickupDate,
    pickupAmount: Math.max(
      0,
      calculation.getPaymentPickupAmt(
        pawnAmount,
        oneTimeFee,
        ticket.transaction_datetime,
        ticket.interest_paid_months,
      ) - Number(ticket.partial_payment ?? 0),
    ),
    baseExtensionAmount,
    extensionAmount: baseExtensionAmount,
    extensionMonths: 1,
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
  const [holidayDateKeys, setHolidayDateKeys] = useState<string[]>([]);
  const [ticketSearchValue, setTicketSearchValue] = useState("");
  const [ticketSearchPreview, setTicketSearchPreview] =
    useState<TicketSearchResult | null>(null);
  const [ticketSearchClientImage, setTicketSearchClientImage] = useState<
    string | null
  >(null);
  const [ticketSearchDialogOpen, setTicketSearchDialogOpen] = useState(false);
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
      {
        field: "dueDate",
        headerName: "DUE",
        width: 104,
        renderCell: (params) => (
          <CellTooltip value={formatIsoDate(params.value)} />
        ),
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
        headerName: mode === "pickup" ? "EXT / 30" : "EXT",
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
      setHolidayDateKeys(holidayDateKeys);
      const oppositeSelectedTicketNumbers = new Set(
        selectedRowsByMode[getOppositeMode(mode)].map(
          (row) => row.ticketNumber,
        ),
      );
      const currentSelectedTicketNumbers = new Set(
        mode === "pickup"
          ? selectedRowsByMode.pickup.map((row) => row.ticketNumber)
          : [],
      );
      const rows = tickets
        .filter((ticket) => ticket.status === "pawned" && !ticket.is_stolen)
        .map((ticket) => mapTicketToPaymentRow(ticket, holidayDateKeys))
        .filter((row): row is PaymentTicketRow => Boolean(row))
        .filter(
          (row) =>
            !currentSelectedTicketNumbers.has(row.ticketNumber) &&
            !oppositeSelectedTicketNumbers.has(row.ticketNumber),
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

  const handleTicketSearch = async () => {
    const ticketNumber = Number(ticketSearchValue);

    setTicketSearchDialogOpen(false);
    setTicketSearchPreview(null);
    setTicketSearchClientImage(null);

    if (!Number.isFinite(ticketNumber) || ticketNumber <= 0) {
      setStatusSeverity("warning");
      setStatusMessage("Enter a valid ticket number.");
      return;
    }

    setLoading(true);
    setStatusMessage("");
    setStatusSeverity("info");

    try {
      const [preview, holidays] = await Promise.all([
        ticketService.searchPaymentTicket(ticketNumber),
        ticketService.loadHolidayDates(),
      ]);

      if (!preview) {
        setStatusSeverity("warning");
        setStatusMessage(`Ticket #${ticketNumber} was not found.`);
        return;
      }

      if (preview.ticket.status !== "pawned") {
        window.alert(`Ticket #${ticketNumber} is not pawned.`);
        return;
      }

      setHolidayDateKeys(holidays.map((holiday) => holiday.holiday_date));
      setTicketSearchPreview(preview);
      const clientImageBase64 = await clientService.loadClientImage(
        preview.client.image_path,
      );
      setTicketSearchClientImage(
        clientImageBase64 ? `data:image/png;base64,${clientImageBase64}` : null,
      );
      setTicketSearchDialogOpen(true);

      if (preview.client.pickup_self_only) {
        window.alert("Only this client can pick up this ticket.");
      }

      if (preview.ticket.is_lost) {
        window.alert("This ticket is marked as lost.");
      }
    } catch (err) {
      console.error(err);
      setStatusSeverity("warning");
      setStatusMessage(
        err instanceof Error ? err.message : "Unable to search ticket.",
      );
    } finally {
      setLoading(false);
    }
  };

  const closeTicketSearchDialog = () => {
    setTicketSearchDialogOpen(false);
  };

  const addTicketSearchPreviewToAvailable = () => {
    if (!ticketSearchPreview) {
      return;
    }

    const searchedRow = mapTicketToPaymentRow(
      ticketSearchPreview.ticket,
      holidayDateKeys,
    );

    if (!searchedRow) {
      setStatusSeverity("warning");
      setStatusMessage("Unable to load that ticket.");
      return;
    }

    if (searchedRow.status !== "pawned") {
      closeTicketSearchDialog();
      setStatusSeverity("warning");
      setStatusMessage(`Ticket #${searchedRow.ticketNumber} is not pawned.`);
      return;
    }

    if (ticketSearchPreview.ticket.is_stolen) {
      closeTicketSearchDialog();
      setStatusSeverity("warning");
      setStatusMessage(
        `Ticket #${searchedRow.ticketNumber} is marked stolen and cannot be paid here.`,
      );
      return;
    }

    const oppositeSelectedTicketNumbers = new Set(
      selectedRowsByMode[getOppositeMode(mode)].map((row) => row.ticketNumber),
    );
    const currentSelectedTicketNumbers = new Set(
      selectedRowsByMode[mode].map((row) => row.ticketNumber),
    );

    if (oppositeSelectedTicketNumbers.has(searchedRow.ticketNumber)) {
      setStatusSeverity("warning");
      setStatusMessage(
        `Ticket #${searchedRow.ticketNumber} is already selected for ${getOppositeMode(
          mode,
        )}.`,
      );
      return;
    }

    if (currentSelectedTicketNumbers.has(searchedRow.ticketNumber)) {
      setStatusSeverity("info");
      setStatusMessage(
        `Ticket #${searchedRow.ticketNumber} is already selected.`,
      );
      closeTicketSearchDialog();
      return;
    }

    setAvailableRowsByMode((prev) => {
      const alreadyAvailable = prev[mode].some(
        (row) => row.ticketNumber === searchedRow.ticketNumber,
      );

      if (alreadyAvailable) {
        return prev;
      }

      return {
        ...prev,
        [mode]: [...prev[mode], searchedRow].sort(
          (a, b) => a.ticketNumber - b.ticketNumber,
        ),
      };
    });
    setAvailableSelectionByMode((prev) => ({
      ...prev,
      [mode]: [searchedRow.id],
    }));
    closeTicketSearchDialog();
    setStatusSeverity("success");
    setStatusMessage(`Ticket #${searchedRow.ticketNumber} loaded.`);
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
        ? availableRows.map((row) => String(row.id))
        : availableSelectionModel.map(String),
    );
    const rightSelectedIds = new Set(
      moveAll || mode !== "extension" ? [] : selectedSelectionModel.map(String),
    );
    const rowsToMove = availableRows.filter((row) =>
      selectedIds.has(String(row.id)),
    );
    const rowsToExtendAgain = selectedRows.filter((row) =>
      rightSelectedIds.has(String(row.id)),
    );
    const rowsToApply =
      mode === "extension"
        ? [
            ...new Map(
              [...rowsToMove, ...rowsToExtendAgain].map((row) => [
                row.ticketNumber,
                row,
              ]),
            ).values(),
          ]
        : rowsToMove;

    if (!rowsToApply.length || !confirmBlockedPickupRows(rowsToMove)) {
      return;
    }

    const oppositeSelectedTicketNumbers = new Set(
      selectedRowsByMode[getOppositeMode(mode)].map((row) => row.ticketNumber),
    );
    const conflictingRows = rowsToApply.filter((row) =>
      oppositeSelectedTicketNumbers.has(row.ticketNumber),
    );

    if (conflictingRows.length) {
      setStatusSeverity("warning");
      setStatusMessage(
        `Ticket #${conflictingRows[0].ticketNumber} is already selected for ${getOppositeMode(
          mode,
        )}. Move it back before choosing ${mode}.`,
      );
      return;
    }

    setSelectedRowsByMode((prev) => ({
      ...prev,
      [mode]:
        mode === "extension"
          ? rowsToApply.reduce<PaymentTicketRow[]>((nextRows, row) => {
              const existingIndex = nextRows.findIndex(
                (selectedRow) => selectedRow.ticketNumber === row.ticketNumber,
              );

              if (existingIndex === -1) {
                return [
                  ...nextRows,
                  {
                    ...row,
                    id: row.ticketNumber,
                    dueDate: addThirtyDayPeriods(row.dueDate, 1),
                    sourceDueDate: row.dueDate,
                    extensionMonths: 1,
                    extensionAmount: row.baseExtensionAmount,
                  },
                ];
              }

              return nextRows.map((selectedRow, index) => {
                if (index !== existingIndex) {
                  return selectedRow;
                }

                const extensionMonths = selectedRow.extensionMonths + 1;

                return {
                  ...selectedRow,
                  dueDate: addThirtyDayPeriods(
                    selectedRow.sourceDueDate,
                    extensionMonths,
                  ),
                  extensionMonths,
                  extensionAmount:
                    selectedRow.baseExtensionAmount * extensionMonths,
                };
              });
            }, prev.extension)
          : [...prev.pickup, ...rowsToMove],
    }));

    if (mode === "pickup") {
      setAvailableRowsByMode((prev) => ({
        ...prev,
        pickup: prev.pickup.filter((row) => !selectedIds.has(String(row.id))),
      }));
    }

    const movedTicketNumbers = new Set(
      rowsToApply.map((row) => row.ticketNumber),
    );
    const oppositeMode = getOppositeMode(mode);

    setAvailableRowsByMode((prev) => ({
      ...prev,
      [oppositeMode]: prev[oppositeMode].filter(
        (row) => !movedTicketNumbers.has(row.ticketNumber),
      ),
    }));

    setAvailableSelectionByMode((prev) => ({ ...prev, [mode]: [] }));
  };

  const moveRowsToAvailable = (moveAll: boolean) => {
    const selectedIds = new Set(
      moveAll
        ? selectedRows.map((row) => String(row.id))
        : selectedSelectionModel.map(String),
    );
    const rowsToMove = selectedRows.filter((row) =>
      selectedIds.has(String(row.id)),
    );

    if (!rowsToMove.length) {
      return;
    }

    const remainingSelectedRows = selectedRows.filter(
      (row) => !selectedIds.has(String(row.id)),
    );
    const stillSelectedTicketNumbers = new Set(
      remainingSelectedRows.map((row) => row.ticketNumber),
    );
    const restorableRowsByTicketNumber = new Map<number, PaymentTicketRow>();
    rowsToMove
      .filter((row) => !stillSelectedTicketNumbers.has(row.ticketNumber))
      .forEach((row) => {
        restorableRowsByTicketNumber.set(row.ticketNumber, {
          ...row,
          id: row.ticketNumber,
          dueDate: row.sourceDueDate,
        });
      });
    const restorableRows = [...restorableRowsByTicketNumber.values()];
    const oppositeMode = getOppositeMode(mode);

    if (mode === "pickup") {
      setAvailableRowsByMode((prev) => ({
        ...prev,
        pickup: [...prev.pickup, ...rowsToMove].sort(
          (a, b) => a.ticketNumber - b.ticketNumber,
        ),
      }));
    }

    if (restorableRows.length) {
      setAvailableRowsByMode((prev) => {
        const existingTicketNumbers = new Set(
          prev[oppositeMode].map((row) => row.ticketNumber),
        );
        const rowsToRestore = restorableRows.filter(
          (row) => !existingTicketNumbers.has(row.ticketNumber),
        );

        if (!rowsToRestore.length) {
          return prev;
        }

        return {
          ...prev,
          [oppositeMode]: [...prev[oppositeMode], ...rowsToRestore].sort(
            (a, b) => a.ticketNumber - b.ticketNumber,
          ),
        };
      });
    }

    setSelectedRowsByMode((prev) => ({
      ...prev,
      [mode]: remainingSelectedRows,
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
    const extensionRows = selectedRowsByMode.extension;

    if (!pickupRows.length && !extensionRows.length) {
      setStatusSeverity("warning");
      setStatusMessage("Move ticket payment(s) to the right table first.");
      return;
    }

    setProcessing(true);
    setStatusSeverity("info");
    setStatusMessage("");

    try {
      const pickupTicketNumbers = new Set(
        pickupRows.map((row) => row.ticketNumber),
      );
      const conflictingExtensionRow = extensionRows.find((row) =>
        pickupTicketNumbers.has(row.ticketNumber),
      );

      if (conflictingExtensionRow) {
        setStatusSeverity("warning");
        setStatusMessage(
          `Ticket #${conflictingExtensionRow.ticketNumber} cannot be picked up and extended at the same time.`,
        );
        return;
      }

      const extensionMonthCounts = extensionRows.reduce<Map<number, number>>(
        (counts, row) => {
          counts.set(
            row.ticketNumber,
            (counts.get(row.ticketNumber) ?? 0) + row.extensionMonths,
          );
          return counts;
        },
        new Map<number, number>(),
      );
      const [pickedUpTickets, extendedTickets] = await Promise.all([
        pickupRows.length
          ? ticketService.pickupTickets({
              tickets: pickupRows.map((row) => ({
                ticket_number: row.ticketNumber,
                pickup_amount_paid: Number(row.pickupAmount ?? 0),
              })),
            })
          : Promise.resolve([]),
        extensionMonthCounts.size
          ? ticketService.extendTickets({
              extensions: [...extensionMonthCounts.entries()].map(
                ([ticketNumber, months]) => ({
                  ticket_number: ticketNumber,
                  months,
                }),
              ),
            })
          : Promise.resolve([]),
      ]);
      const pickedUpIds = new Set(
        pickedUpTickets
          .map((ticket) => ticket.ticket_number)
          .filter((ticketNumber): ticketNumber is number =>
            Number.isFinite(ticketNumber),
          ),
      );
      const extendedRowByTicketNumber = new Map(
        extendedTickets
          .map((ticket) => mapTicketToPaymentRow(ticket, holidayDateKeys))
          .filter((row): row is PaymentTicketRow => Boolean(row))
          .map((row) => [row.ticketNumber, row]),
      );
      const replaceExtendedRow = (row: PaymentTicketRow) =>
        extendedRowByTicketNumber.get(row.ticketNumber) ?? row;

      setSelectedRowsByMode((prev) => ({
        ...prev,
        pickup: prev.pickup.filter((row) => !pickedUpIds.has(row.ticketNumber)),
        extension: [],
      }));
      setAvailableRowsByMode((prev) => ({
        ...prev,
        pickup: prev.pickup
          .filter((row) => !pickedUpIds.has(row.ticketNumber))
          .map(replaceExtendedRow),
        extension: prev.extension
          .filter((row) => !pickedUpIds.has(row.ticketNumber))
          .map(replaceExtendedRow),
      }));
      setAvailableSelectionByMode(createEmptySelectionByMode());
      setSelectedSelectionByMode(createEmptySelectionByMode());
      if (Number.isFinite(clientNumber) && clientNumber > 0) {
        const channel = new BroadcastChannel("payment-events");
        channel.postMessage({
          type: "payment-completed",
          clientNumber,
          pickedUpCount: pickedUpTickets.length,
        } satisfies PaymentCompletedEvent);
        channel.close();
      }
      window.close();
    } catch (err) {
      console.error(err);
      setStatusSeverity("warning");
      setStatusMessage(
        err instanceof Error ? err.message : "Unable to process payment(s).",
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
      ticketSearchValue,
      ticketSearchPreview,
      ticketSearchClientImage,
      ticketSearchDialogOpen,
      pickupSummaryAmount,
      extensionSummaryAmount,
      totalSummaryAmount,
    },
    actions: {
      setMode,
      setTicketSearchValue,
      handleLoad,
      handleTicketSearch,
      closeTicketSearchDialog,
      addTicketSearchPreviewToAvailable,
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
