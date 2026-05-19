import React from "react";
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
import type { TransactionItemLoadRequest } from "./controllers/useTransactionPageController";
import { useTransactionPageController } from "./controllers/useTransactionPageController";
import ClientBar from "../components/shared/ClientBar";
import TransactionTicketsPanel from "../components/transaction/tickets/TransactionTicketsPanel";
import TransactionItemsPanel from "../components/transaction/items/TransactionItemsPanel";
import TicketPawnDialog from "../components/transaction/dialogs/TicketPawnDialog";
import TicketSellDialog from "../components/transaction/dialogs/TicketSellDialog";
import TicketEditDialog from "../components/transaction/dialogs/TicketEditDialog";
import TicketTransferDialog from "../components/transaction/dialogs/TicketTransferDialog";
import TicketConvertDialog from "../components/transaction/dialogs/TicketConvertDialog";
import TicketExpireDialog from "../components/transaction/dialogs/TicketExpireDialog";
import ItemEditDialog from "../components/transaction/dialogs/ItemEditDialog";

export type { TransactionItemLoadRequest };

interface TransactionPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
  clientMiddleName?: string;
  focusTicketNumber?: number;
  focusRequestId?: number;
  refreshKey?: number;
  incomingTicket?: Ticket | null;
  incomingItemLoadRequest?: TransactionItemLoadRequest | null;
  onSelectedTicketChange?: (ticket: Ticket | null) => void;
  onHistoryRefreshRequest?: () => void;
}

const TransactionPage: React.FC<TransactionPageProps> = ({
  clientNumber,
  clientLastName,
  clientFirstName,
  clientMiddleName,
  focusTicketNumber,
  focusRequestId,
  refreshKey,
  incomingTicket,
  incomingItemLoadRequest,
  onSelectedTicketChange,
  onHistoryRefreshRequest,
}) => {
  const { state, actions } = useTransactionPageController({
    clientNumber,
    focusTicketNumber,
    focusRequestId,
    refreshKey,
    incomingTicket,
    incomingItemLoadRequest,
    onSelectedTicketChange,
    onHistoryRefreshRequest,
  });
  const {
    tickets,
    items,
    selectedTicket,
    selectedItem,
    loading,
    itemsLoading,
    ticketsError,
    itemsError,
    statusMessage,
    openTicketPawnDialog,
    openTicketSellDialog,
    openTicketEditDialog,
    openTicketConvertDialog,
    openTicketExpireDialog,
    openTicketTransferDialog,
    openItemDialog,
    itemDialogMode,
    removeItemTarget,
    itemCategories,
  } = state;

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
      <ClientBar
        client_last_name={clientLastName}
        client_first_name={clientFirstName}
        client_middle_name={clientMiddleName}
        sx={{ mb: 1 }}
      />

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
        <TransactionTicketsPanel
          tickets={tickets}
          selectedTicket={selectedTicket}
          transferDisabled={!clientNumber}
          onSelectTicket={actions.handleTicketSelected}
          onPawn={actions.handlePawnButtonClick}
          onSell={actions.handleSellButtonClick}
          onEdit={actions.handleEditButtonClick}
          onPrint={actions.handleTicketPrint}
          onConvert={actions.handleConvertTicket}
          onTransfer={actions.handleTransferTicket}
          onExpire={actions.handleTicketExpire}
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
          <TransactionItemsPanel
            items={items}
            selectedItem={selectedItem ?? undefined}
            loading={itemsLoading}
            error={itemsError}
            onItemSelected={actions.handleItemClick}
            onAdd={actions.handleAddItem}
            onEdit={actions.handleEditItem}
            onDelete={actions.handleRemoveItem}
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
          onClose={() => actions.setopenTicketPawnDialog(false)}
          onSave={actions.handlePawnTicket}
        />
      )}

      {openTicketSellDialog && (
        <TicketSellDialog
          open={openTicketSellDialog}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => actions.setopenTicketSellDialog(false)}
          onSave={actions.handleSellTicket}
        />
      )}

      {openTicketEditDialog && (
        <TicketEditDialog
          open={openTicketEditDialog}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          ticket={selectedTicket}
          onClose={() => actions.setopenTicketEditDialog(false)}
          onSave={actions.handleEditTicket}
        />
      )}

      {openTicketTransferDialog && (
        <TicketTransferDialog
          open={openTicketTransferDialog}
          clientNumber={clientNumber}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => actions.setOpenTicketTransferDialog(false)}
          onLoadPreview={actions.handleLoadTransferTicketPreview}
          onTransfer={actions.handleTransferTicketConfirmed}
        />
      )}

      {openTicketExpireDialog && (
        <TicketExpireDialog
          open={openTicketExpireDialog}
          ticket={selectedTicket}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => actions.setOpenTicketExpireDialog(false)}
          onSave={actions.handleExpireTicketConfirmed}
        />
      )}

      {openTicketConvertDialog && (
        <TicketConvertDialog
          open={openTicketConvertDialog}
          ticket={selectedTicket}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          onClose={() => actions.setOpenTicketConvertDialog(false)}
          onSave={actions.handleConvertTicketConfirmed}
        />
      )}

      {selectedTicket?.ticket_number && (
        <ItemEditDialog
          open={openItemDialog}
          mode={itemDialogMode}
          ticketNumber={selectedTicket.ticket_number}
          item={itemDialogMode === "edit" ? selectedItem : null}
          categories={itemCategories}
          onClose={() => actions.setOpenItemDialog(false)}
          onSave={actions.handleItemSaved}
        />
      )}

      <Dialog
        open={Boolean(removeItemTarget)}
        onClose={() => actions.setRemoveItemTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove item #
            {removeItemTarget?.item_number}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => actions.setRemoveItemTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => void actions.handleConfirmRemoveItem()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TransactionPage;
