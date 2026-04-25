import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import type { Ticket } from "../../shared/types/Ticket";
import type { Item } from "../../shared/types/Item";
import ClientBar from "../components/shared/ClientBar";
import TicketsPanel from "../components/transaction/tickets/TicketsPanel";
import ItemsPanel from "../components/transaction/items/ItemsPanel";
import TicketPawnDialog from "../components/transaction/dialogs/TicketPawnDialog";
import TicketSellDialog from "../components/transaction/dialogs/TicketSellDialog";
import TicketEditDialog from "../components/transaction/dialogs/TicketEditDialog";
import TicketTransferDialog from "../components/transaction/dialogs/TicketTransferDialog";
import TicketConvertDialog from "../components/transaction/dialogs/TicketConvertDialog";
import TicketExpireDialog from "../components/transaction/dialogs/TicketExpireDialog";
import TicketItemLoadDialog from "../components/transaction/dialogs/TicketItemLoadDialog";
import ItemEditDialog from "../components/transaction/dialogs/ItemEditDialog";
import {
  type ConvertTicketInput,
  type ExpireTicketInput,
  ticketService,
  type CreatePawnTicketInput,
  type CreateSellTicketInput,
  type TransferTicketPreview,
  type UpdateTicketInput,
} from "../services/ticketService";
import { itemService } from "../services/itemService";
import type { ItemCategoryOption } from "../services/itemService";

export interface TransactionItemLoadRequest {
  requestId: number;
  targetTicketNumber: number;
  sourceTicketNumber: number;
  sourceTicketDescription: string;
  items: Item[];
  mode: "repawn" | "load";
}

interface TransactionPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
  clientMiddleName?: string;
  focusTicketNumber?: number;
  focusRequestId?: number;
  incomingTicket?: Ticket | null;
  incomingItemLoadRequest?: TransactionItemLoadRequest | null;
  onSelectedTicketChange?: (ticket: Ticket | null) => void;
}

const TransactionPage: React.FC<TransactionPageProps> = (props) => {
  const {
    clientNumber,
    clientLastName,
    clientFirstName,
    clientMiddleName,
    focusTicketNumber,
    focusRequestId,
    incomingTicket,
    incomingItemLoadRequest,
    onSelectedTicketChange,
  } = props;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string>("");
  const [itemsError, setItemsError] = useState<string>("");
  const [openTicketPawnDialog, setopenTicketPawnDialog] = useState(false);
  const [openTicketSellDialog, setopenTicketSellDialog] = useState(false);
  const [openTicketEditDialog, setopenTicketEditDialog] = useState(false);
  const [openTicketConvertDialog, setOpenTicketConvertDialog] = useState(false);
  const [openTicketExpireDialog, setOpenTicketExpireDialog] = useState(false);
  const [openTicketTransferDialog, setOpenTicketTransferDialog] = useState(false);
  const [openTicketItemLoadDialog, setOpenTicketItemLoadDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [itemDialogMode, setItemDialogMode] = useState<"add" | "edit">("add");
  const [removeItemTarget, setRemoveItemTarget] = useState<Item | null>(null);
  const [itemCategories, setItemCategories] = useState<ItemCategoryOption[]>([]);
  const [ticketDraftItems, setTicketDraftItems] = useState<Record<number, Item[]>>({});
  const [draftItemSequence, setDraftItemSequence] = useState(-1);
  const [pendingLoadRequest, setPendingLoadRequest] =
    useState<TransactionItemLoadRequest | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const filterVisibleTickets = (nextTickets: Ticket[]) =>
    nextTickets.filter(
      (ticket) => ticket.status === "pawned" || ticket.status === "sold",
    );
  const sortTickets = (nextTickets: Ticket[]) =>
    [...nextTickets].sort((a, b) => {
      const aTime = a.transaction_datetime.getTime();
      const bTime = b.transaction_datetime.getTime();

      if (aTime !== bTime) {
        return aTime - bTime;
      }

      return (a.ticket_number ?? 0) - (b.ticket_number ?? 0);
    });

  const loading = ticketsLoading || itemsLoading;
  const displayedItems = selectedTicket?.ticket_number
    ? [...items, ...(ticketDraftItems[selectedTicket.ticket_number] ?? [])]
    : [];

  useEffect(() => {
    let active = true;

    const fetchTickets = async () => {
      if (!clientNumber) {
        setTickets([]);
        setItems([]);
        setTicketDraftItems({});
        setSelectedTicket(null);
        setSelectedItem(null);
        setTicketsError("");
        setItemsError("");
        setStatusMessage("");
        return;
      }

      setTicketsLoading(true);
      setTicketsError("");
      setStatusMessage("");

      try {
        const fetchedTickets = await ticketService.loadTickets(clientNumber);
        const visibleTickets = filterVisibleTickets(fetchedTickets);
        if (!active) {
          return;
        }

        setTickets(visibleTickets);
        setSelectedTicket((prev) => {
          if (!visibleTickets.length) {
            return null;
          }

          if (!prev) {
            return visibleTickets[visibleTickets.length - 1];
          }

          return (
            visibleTickets.find(
              (ticket) => ticket.ticket_number === prev.ticket_number,
            ) ?? visibleTickets[visibleTickets.length - 1]
          );
        });
      } finally {
        if (!active) {
          return;
        }

        setTicketsLoading(false);
      }
    };

    fetchTickets();

    return () => {
      active = false;
    };
  }, [clientNumber]);

  useEffect(() => {
    if (!focusRequestId || !focusTicketNumber) {
      return;
    }

    const matchedTicket =
      tickets.find((ticket) => ticket.ticket_number === focusTicketNumber) ?? null;

    if (matchedTicket) {
      setSelectedTicket(matchedTicket);
      setStatusMessage("");
    }
  }, [focusRequestId, focusTicketNumber, tickets]);

  useEffect(() => {
    if (!incomingTicket?.ticket_number) {
      return;
    }

    setTickets((prev) => {
      const nextTickets = prev.some(
        (ticket) => ticket.ticket_number === incomingTicket.ticket_number,
      )
        ? prev.map((ticket) =>
            ticket.ticket_number === incomingTicket.ticket_number
              ? incomingTicket
              : ticket,
          )
        : sortTickets([...prev, incomingTicket]);

      return nextTickets;
    });
  }, [incomingTicket]);

  useEffect(() => {
    if (!incomingItemLoadRequest) {
      return;
    }

    setPendingLoadRequest(incomingItemLoadRequest);
    setOpenTicketItemLoadDialog(true);
    setStatusMessage("");
  }, [incomingItemLoadRequest]);

  useEffect(() => {
    let active = true;

    itemService.preloadCategories().then((categories) => {
      if (active) {
        setItemCategories(categories);
      }
    }).catch((err) => {
      console.error(err);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchItems = async () => {
      if (!selectedTicket?.ticket_number) {
        setItems([]);
        setSelectedItem(null);
        setItemsError("");
        return;
      }

      setItemsLoading(true);
      setItemsError("");

      try {
        const fetchedItems = await itemService.loadItems(
          selectedTicket.ticket_number,
        );
        if (!active) {
          return;
        }

        setItems(fetchedItems);
        setSelectedItem((prev) => {
          if (!fetchedItems.length) {
            return null;
          }

          if (!prev) {
            return fetchedItems[0];
          }

          return (
            fetchedItems.find(
              (item) => item.item_number === prev.item_number,
            ) ?? fetchedItems[0]
          );
        });
      } finally {
        if (!active) {
          return;
        }

        setItemsLoading(false);
      }
    };

    fetchItems();

    return () => {
      active = false;
    };
  }, [selectedTicket?.ticket_number]);

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    const matchedTicket =
      tickets.find(
        (ticket) => ticket.ticket_number === selectedTicket.ticket_number,
      ) ?? null;

    if (!matchedTicket) {
      setSelectedTicket(tickets[0] ?? null);
    }
  }, [tickets, selectedTicket]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const matchedItem =
      displayedItems.find(
        (item) =>
          (item.draft_id ?? item.item_number) ===
          (selectedItem.draft_id ?? selectedItem.item_number),
      ) ??
      null;

    if (!matchedItem) {
      setSelectedItem(displayedItems[0] ?? null);
    }
  }, [displayedItems, selectedItem]);

  useEffect(() => {
    onSelectedTicketChange?.(selectedTicket);
  }, [onSelectedTicketChange, selectedTicket]);

  const handleTicketSelected = (ticket: Ticket | null) => {
    setSelectedTicket(ticket);
    setStatusMessage("");
  };

  const handlePawnButtonClick = () => {
    setopenTicketPawnDialog(true);
    setStatusMessage("");
  };

  const handleEditButtonClick = () => {
    setopenTicketEditDialog(true);
    setStatusMessage("");
  };

  const handleSellButtonClick = () => {
    setopenTicketSellDialog(true);
    setStatusMessage("");
  };

  const handleTicketPrint = () => {
    if (!selectedTicket) {
      return;
    }

    window.print();
  };

  const handleConvertTicket = () => {
    if (!selectedTicket) {
      return;
    }

    setOpenTicketConvertDialog(true);
    setStatusMessage("");
  };

  const handleTransferTicket = () => {
    if (!clientNumber) {
      return;
    }

    setOpenTicketTransferDialog(true);
    setStatusMessage("");
  };

  const handleTicketExpire = () => {
    if (!selectedTicket) {
      return;
    }

    setOpenTicketExpireDialog(true);
    setStatusMessage("");
  };

  const handlePawnTicket = async (
    ticketData: Omit<CreatePawnTicketInput, "client_number">,
  ): Promise<void> => {
    if (!clientNumber) {
      throw new Error("Please select a client first.");
    }

    const newTicket = await ticketService.createPawnTicket({
      ...ticketData,
      client_number: clientNumber,
    });

    setTickets((prev) => sortTickets([...prev, newTicket]));
    setSelectedTicket(newTicket);
    setItems([]);
    setSelectedItem(null);
    setopenTicketPawnDialog(false);
    setStatusMessage(`Ticket #${newTicket.ticket_number} pawned.`);
  };

  const handleSellTicket = async (
    ticketData: Omit<CreateSellTicketInput, "client_number">,
  ): Promise<void> => {
    if (!clientNumber) {
      throw new Error("Please select a client first.");
    }

    const newTicket = await ticketService.createSellTicket({
      ...ticketData,
      client_number: clientNumber,
    });

    setTickets((prev) => sortTickets([...prev, newTicket]));
    setSelectedTicket(newTicket);
    setItems([]);
    setSelectedItem(null);
    setopenTicketSellDialog(false);
    setStatusMessage(`Ticket #${newTicket.ticket_number} sold.`);
  };

  const handleEditTicket = async (data: UpdateTicketInput): Promise<void> => {
    if (!selectedTicket) {
      throw new Error("Please select a ticket first.");
    }

    const updatedTicket = await ticketService.updateTicket(data);

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_number === selectedTicket.ticket_number
          ? updatedTicket
          : ticket,
      ),
    );
    setSelectedTicket(updatedTicket);
    setopenTicketEditDialog(false);
    setStatusMessage(`Ticket #${updatedTicket.ticket_number} updated.`);
  };

  const handleLoadTransferTicketPreview = async (
    ticketNumber: number,
  ): Promise<TransferTicketPreview | null> => {
    return ticketService.loadTransferTicketPreview(ticketNumber);
  };

  const handleConvertTicketConfirmed = async (
    data: ConvertTicketInput,
  ): Promise<void> => {
    if (!selectedTicket) {
      throw new Error("Please select a ticket first.");
    }

    const convertedTicket = await ticketService.convertTicket(data);
    const fromStatus = selectedTicket.status;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_number === convertedTicket.ticket_number
          ? convertedTicket
          : ticket,
      ),
    );
    setSelectedTicket(convertedTicket);
    const refreshedItems = convertedTicket.ticket_number
      ? await itemService.loadItems(convertedTicket.ticket_number)
      : [];
    setItems(refreshedItems);
    setSelectedItem((prev) => {
      if (!refreshedItems.length) {
        return null;
      }

      return (
        refreshedItems.find((item) => item.item_number === prev?.item_number) ??
        refreshedItems[0]
      );
    });
    setOpenTicketConvertDialog(false);
    setStatusMessage(
      `Ticket #${convertedTicket.ticket_number} converted from ${fromStatus} to ${convertedTicket.status}.`,
    );
  };

  const handleExpireTicketConfirmed = async (
    data: ExpireTicketInput,
  ): Promise<void> => {
    if (!selectedTicket) {
      throw new Error("Please select a ticket first.");
    }

    const expiredTicket = await ticketService.expireTicket(data);

    setTickets((prev) =>
      prev.filter(
        (ticket) => ticket.ticket_number !== expiredTicket.ticket_number,
      ),
    );
    setSelectedTicket(null);
    setItems([]);
    setSelectedItem(null);
    setOpenTicketExpireDialog(false);
    setStatusMessage(`Ticket #${expiredTicket.ticket_number} expired.`);
  };

  const handleTransferTicketConfirmed = async (
    ticketNumber: number,
  ): Promise<void> => {
    if (!clientNumber) {
      throw new Error("Please select a client first.");
    }

    const transferredTicket = await ticketService.transferTicket({
      ticket_number: ticketNumber,
      client_number: clientNumber,
    });
    const refreshedTickets = filterVisibleTickets(
      await ticketService.loadTickets(clientNumber),
    );

    setTickets(refreshedTickets);
    setSelectedTicket(
      refreshedTickets.find(
        (ticket) => ticket.ticket_number === transferredTicket.ticket_number,
      ) ?? transferredTicket,
    );
    setItems([]);
    setSelectedItem(null);
    setOpenTicketTransferDialog(false);
    setStatusMessage(`Ticket #${transferredTicket.ticket_number} transferred.`);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setStatusMessage("");
  };

  const handleAddItem = () => {
    if (!selectedTicket?.ticket_number) {
      setStatusMessage("Select a ticket first.");
      return;
    }

    setItemDialogMode("add");
    setSelectedItem(null);
    setOpenItemDialog(true);
    setStatusMessage("");
  };

  const handleEditItem = (item: Item) => {
    if (item.is_loaded_draft) {
      setStatusMessage("Loaded draft items must be saved before editing.");
      return;
    }

    setSelectedItem(item);
    setItemDialogMode("edit");
    setOpenItemDialog(true);
    setStatusMessage("");
  };

  const handleRemoveItem = (item: Item) => {
    setRemoveItemTarget(item);
    setStatusMessage("");
  };

  const handleItemSaved = (savedItem: Item) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.item_number === savedItem.item_number);
      return exists
        ? prev.map((item) =>
            item.item_number === savedItem.item_number ? savedItem : item,
          )
        : [savedItem, ...prev];
    });
    setSelectedItem(savedItem);
    setOpenItemDialog(false);
    setStatusMessage(`Item #${savedItem.item_number} saved.`);
  };

  const handleConfirmRemoveItem = async () => {
    if (!removeItemTarget || !selectedTicket?.ticket_number) {
      setRemoveItemTarget(null);
      return;
    }

    if (removeItemTarget.is_loaded_draft) {
      const ticketNumber = selectedTicket.ticket_number;
      const nextDraftItems = (ticketDraftItems[ticketNumber] ?? []).filter(
        (current) =>
          (current.draft_id ?? current.item_number) !==
          (removeItemTarget.draft_id ?? removeItemTarget.item_number),
      );

      setTicketDraftItems((prev) => ({
        ...prev,
        [ticketNumber]: nextDraftItems,
      }));
      setSelectedItem((prev) => {
        if (
          (prev?.draft_id ?? prev?.item_number) !==
          (removeItemTarget.draft_id ?? removeItemTarget.item_number)
        ) {
          return prev ?? null;
        }

        return [...items, ...nextDraftItems][0] ?? null;
      });
      setStatusMessage(
        `Loaded item #${removeItemTarget.source_item_number ?? removeItemTarget.item_number} removed from this ticket view.`,
      );
      setRemoveItemTarget(null);
      return;
    }

    await itemService.deleteItem(
      selectedTicket.ticket_number,
      removeItemTarget.item_number,
    );

    const nextItems = items.filter(
      (current) => current.item_number !== removeItemTarget.item_number,
    );

    setItems(nextItems);
    setSelectedItem((prev) => {
      if ((prev?.draft_id ?? prev?.item_number) !== removeItemTarget.item_number) {
        return prev ?? null;
      }

      return [
        ...nextItems,
        ...(selectedTicket.ticket_number
          ? (ticketDraftItems[selectedTicket.ticket_number] ?? [])
          : []),
      ][0] ?? null;
    });
    setRemoveItemTarget(null);
    setStatusMessage(`Item #${removeItemTarget.item_number} removed.`);
  };

  const handleConfirmLoadedItems = (selectedItems: Item[]) => {
    if (!pendingLoadRequest || !selectedItems.length) {
      setOpenTicketItemLoadDialog(false);
      setPendingLoadRequest(null);
      return;
    }

    const nextDraftItems = selectedItems.map((item, index) => ({
      ...item,
      source_item_number: item.source_item_number ?? item.item_number,
      item_number: draftItemSequence - index,
      draft_id: `draft-${pendingLoadRequest.requestId}-${item.item_number}-${index}`,
      is_loaded_draft: true,
    }));

    setDraftItemSequence((prev) => prev - selectedItems.length);
    setTicketDraftItems((prev) => ({
      ...prev,
      [pendingLoadRequest.targetTicketNumber]: [
        ...(prev[pendingLoadRequest.targetTicketNumber] ?? []),
        ...nextDraftItems,
      ],
    }));
    setSelectedItem((prev) => prev ?? nextDraftItems[0] ?? null);
    setOpenTicketItemLoadDialog(false);
    setStatusMessage(
      `${selectedItems.length} item(s) loaded from ticket #${pendingLoadRequest.sourceTicketNumber} into ticket #${pendingLoadRequest.targetTicketNumber}.`,
    );
    setPendingLoadRequest(null);
  };

  if (!clientNumber) {
    return (
      <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
        <Typography color="text.secondary">
          Please search and select a client first.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: "100%",
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          mb: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          px: 1.5,
          py: 1,
          backgroundColor: "background.paper",
          boxShadow: 1,
        }}
      >
        <ClientBar
          client_last_name={clientLastName}
          client_first_name={clientFirstName}
          client_middle_name={clientMiddleName}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <TicketsPanel
          tickets={tickets}
          selectedTicket={selectedTicket}
          transferDisabled={!clientNumber}
          onSelectTicket={handleTicketSelected}
          onPawn={handlePawnButtonClick}
          onSell={handleSellButtonClick}
          onEdit={handleEditButtonClick}
          onPrint={handleTicketPrint}
          onConvert={handleConvertTicket}
          onTransfer={handleTransferTicket}
          onExpire={handleTicketExpire}
        />

        {(ticketsError || statusMessage) && (
          <Box sx={{ px: 0.5 }}>
            {ticketsError && (
              <Typography variant="body2" color="error">
                {ticketsError}
              </Typography>
            )}
            {statusMessage && (
              <Typography variant="body2" color="text.secondary">
                {statusMessage}
              </Typography>
            )}
          </Box>
        )}

        <Paper
          sx={{
            flex: 1,
            minHeight: 0,
            p: 1,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            boxShadow:
              "0 0 0 1px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
            boxSizing: "border-box",
            overflow: "hidden",
            backgroundColor: "background.paper",
          }}
        >
          <ItemsPanel
            items={displayedItems}
            selectedItem={selectedItem ?? undefined}
            loading={itemsLoading}
            error={itemsError}
            onItemSelected={handleItemClick}
            onAdd={handleAddItem}
            onEdit={handleEditItem}
            onDelete={handleRemoveItem}
          />
        </Paper>
      </Box>

      {loading && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ position: "absolute", right: 16, bottom: 10 }}
        >
          Loading data...
        </Typography>
      )}

      {openTicketPawnDialog && (
        <TicketPawnDialog
          open={openTicketPawnDialog}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => setopenTicketPawnDialog(false)}
          onSave={handlePawnTicket}
        />
      )}

      {openTicketSellDialog && (
        <TicketSellDialog
          open={openTicketSellDialog}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => setopenTicketSellDialog(false)}
          onSave={handleSellTicket}
        />
      )}

      {openTicketEditDialog && (
        <TicketEditDialog
          open={openTicketEditDialog}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          ticket={selectedTicket}
          onClose={() => setopenTicketEditDialog(false)}
          onSave={handleEditTicket}
        />
      )}

      {openTicketTransferDialog && (
        <TicketTransferDialog
          open={openTicketTransferDialog}
          clientNumber={clientNumber}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => setOpenTicketTransferDialog(false)}
          onLoadPreview={handleLoadTransferTicketPreview}
          onTransfer={handleTransferTicketConfirmed}
        />
      )}

      {openTicketExpireDialog && (
        <TicketExpireDialog
          open={openTicketExpireDialog}
          ticket={selectedTicket}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => setOpenTicketExpireDialog(false)}
          onSave={handleExpireTicketConfirmed}
        />
      )}

      {openTicketConvertDialog && (
        <TicketConvertDialog
          open={openTicketConvertDialog}
          ticket={selectedTicket}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => setOpenTicketConvertDialog(false)}
          onSave={handleConvertTicketConfirmed}
        />
      )}

      {pendingLoadRequest && openTicketItemLoadDialog && (
        <TicketItemLoadDialog
          open={openTicketItemLoadDialog}
          title={
            pendingLoadRequest.mode === "repawn"
              ? `Repawn Ticket #${pendingLoadRequest.sourceTicketNumber} Items`
              : `Load Ticket #${pendingLoadRequest.sourceTicketNumber} Items`
          }
          description={`Select the items from ticket #${pendingLoadRequest.sourceTicketNumber} (${pendingLoadRequest.sourceTicketDescription}) and add them to ticket #${pendingLoadRequest.targetTicketNumber}.`}
          actionLabel="Add to Ticket"
          items={pendingLoadRequest.items}
          onClose={() => {
            setOpenTicketItemLoadDialog(false);
            setPendingLoadRequest(null);
          }}
          onConfirm={handleConfirmLoadedItems}
        />
      )}

      {selectedTicket?.ticket_number && (
        <ItemEditDialog
          open={openItemDialog}
          mode={itemDialogMode}
          ticketNumber={selectedTicket.ticket_number}
          item={itemDialogMode === "edit" ? selectedItem : null}
          categories={itemCategories}
          onClose={() => setOpenItemDialog(false)}
          onSave={handleItemSaved}
        />
      )}

      <Dialog
        open={Boolean(removeItemTarget)}
        onClose={() => setRemoveItemTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove item #{removeItemTarget?.item_number}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveItemTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => void handleConfirmRemoveItem()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TransactionPage;
