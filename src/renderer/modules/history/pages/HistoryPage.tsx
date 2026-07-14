import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { Ticket } from "../../../../shared/types/Ticket";
import type { Item } from "../../../../shared/types/Item";
import ClientBar from "../../../shared/ui/ClientBar";
import HistoryTicketsPanel from "../../tickets/components/history/HistoryTicketsPanel";
import HistoryItemsPanel from "../../items/components/history/HistoryItemsPanel";
import TicketPawnDialog from "../../tickets/components/dialogs/TicketPawnDialog";
import ItemEditDialog from "../../items/components/dialogs/ItemEditDialog";
import { useHistoryPage } from "../hooks/useHistoryPage";

interface HistoryPageProps {
  clientNumber?: number;
  clientLastName?: string;
  clientFirstName?: string;
  clientMiddleName?: string;
  focusTicketNumber?: number;
  focusRequestId?: number;
  refreshKey?: number;
  activationKey?: number;
  transactionTargetTicket?: Ticket | null;
  onRepawnCreated?: (
    ticket: Ticket,
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => void;
  onLoadItemsToTransaction?: (
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({
  clientNumber,
  clientLastName,
  clientFirstName,
  clientMiddleName,
  focusTicketNumber,
  focusRequestId,
  refreshKey = 0,
  activationKey = 0,
  transactionTargetTicket,
  onRepawnCreated,
  onLoadItemsToTransaction,
}) => {
  const { state, actions } = useHistoryPage({
    clientNumber,
    focusTicketNumber,
    focusRequestId,
    refreshKey,
    activationKey,
    transactionTargetTicket,
    onRepawnCreated,
    onLoadItemsToTransaction,
  });
  const {
    tickets,
    selectedTicket,
    items,
    selectedItem,
    ticketsLoading,
    itemsLoading,
    statusMessage,
    openRepawnDialog,
    openItemEditDialog,
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
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "hidden",
        }}
      >
        <HistoryTicketsPanel
          tickets={tickets}
          selectedTicket={selectedTicket}
          loading={ticketsLoading}
          scrollRequestKey={state.ticketScrollRequestKey}
          onSelectTicket={(ticket) => {
            actions.setSelectedTicket(ticket);
            actions.setStatusMessage("");
          }}
          onRepawn={actions.handleRepawn}
          onLoad={actions.handleLoad}
        />

        {statusMessage && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
            {statusMessage}
          </Typography>
        )}

        <HistoryItemsPanel
          items={items}
          selectedItem={selectedItem}
          loading={itemsLoading}
          onSelectItem={actions.setSelectedItem}
          onEditItem={actions.handleEditItem}
        />
      </Box>

      {openRepawnDialog && selectedTicket && (
        <TicketPawnDialog
          open={openRepawnDialog}
          clientFirstName={clientFirstName || ""}
          clientLastName={clientLastName || ""}
          clientMiddleName={clientMiddleName}
          dialogTitle={`Repawn Ticket #${selectedTicket.ticket_number}`}
          saveLabel="Repawn"
          initialValues={{
            description: selectedTicket.description,
            location: selectedTicket.location,
            amount: selectedTicket.amount,
            onetime_fee: selectedTicket.onetime_fee,
          }}
          onClose={() => actions.setOpenRepawnDialog(false)}
          onSave={actions.handleRepawnSave}
        />
      )}

      {openItemEditDialog && selectedTicket?.ticket_number && (
        <ItemEditDialog
          open={openItemEditDialog}
          mode="edit"
          ticketNumber={selectedTicket.ticket_number}
          item={selectedItem}
          categories={itemCategories}
          onClose={() => actions.setOpenItemEditDialog(false)}
          onSave={actions.handleItemSaved}
        />
      )}
    </Paper>
  );
};

export default HistoryPage;
