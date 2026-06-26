import { useEffect, useMemo, useRef, useState } from "react";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { TicketSearchResult } from "../../../../shared/types/ticketApiTypes";
import { clientService } from "../../clients/client.api";
import { ticketService } from "../ticket.api";
import { createPaymentColumns } from "./payment.columns";
import {
  loadAvailablePaymentRows,
  processPaymentRows,
} from "./payment.data";
import {
  createEmptyRowsByMode,
  createEmptySelectionByMode,
  getOppositeMode,
  mapTicketToPaymentRow,
} from "./payment.helpers";
import { createPaymentRowActions } from "./payment.rowActions";
import type {
  PaymentCompletedEvent,
  PaymentMode,
  PaymentRowsByMode,
  PaymentSelectionByMode,
  PaymentStatusSeverity,
} from "./payment.types";

export type { PaymentMode } from "./payment.types";

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
  const rowActions = createPaymentRowActions({
    mode,
    availableRows,
    selectedRows,
    availableSelectionModel,
    selectedSelectionModel,
    selectedRowsByMode,
    setAvailableRowsByMode,
    setSelectedRowsByMode,
    setAvailableSelectionByMode,
    setSelectedSelectionByMode,
    setStatusSeverity,
    setStatusMessage,
  });

  const columns = useMemo(() => createPaymentColumns(mode), [mode]);

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
      const { holidayDateKeys, rows } = await loadAvailablePaymentRows({
        clientNumber,
        mode,
        selectedRowsByMode,
      });
      setHolidayDateKeys(holidayDateKeys);
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

      const { pickedUpIds, pickedUpCount, replaceExtendedRow } =
        await processPaymentRows({
          pickupRows,
          extensionRows,
          holidayDateKeys,
        });

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
          pickedUpCount,
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
      moveSelectedToSelected: () => rowActions.moveRowsToSelected(false),
      moveAllToSelected: () => rowActions.moveRowsToSelected(true),
      moveSelectedToAvailable: () => rowActions.moveRowsToAvailable(false),
      moveAllToAvailable: () => rowActions.moveRowsToAvailable(true),
    },
  };
};
