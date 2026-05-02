import React from "react";
import { Box, Paper } from "@mui/material";
import type { Ticket } from "../../../../shared/types/Ticket";
import { TICKET_ACTIONS_PANEL_WIDTH } from "../../layout/layoutSizing";
import HistoryTicketActions from "./HistoryTicketActions";
import HistoryTicketsTable from "./HistoryTicketsTable";

interface HistoryTicketsPanelProps {
  tickets: Ticket[];
  selectedTicket?: Ticket | null;
  loading?: boolean;
  onSelectTicket: (ticket: Ticket | null) => void;
  onRepawn: () => void;
  onLoad: () => void;
}

const HistoryTicketsPanel: React.FC<HistoryTicketsPanelProps> = ({
  tickets,
  selectedTicket,
  loading = false,
  onSelectTicket,
  onRepawn,
  onLoad,
}) => {
  return (
    <Paper
      sx={{
        flex: "0 0 54%",
        minHeight: 0,
        display: "flex",
        gap: 0.75,
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        p: 1,
        backgroundColor: "background.paper",
        boxShadow:
          "0 0 0 1px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        <HistoryTicketsTable
          tickets={tickets}
          selectedTicket={selectedTicket}
          loading={loading}
          onSelectTicket={onSelectTicket}
        />
      </Box>

      <Paper
        sx={{
          width: TICKET_ACTIONS_PANEL_WIDTH,
          minHeight: 0,
          p: 1.25,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <HistoryTicketActions
          selectedTicket={selectedTicket}
          onRepawn={onRepawn}
          onLoad={onLoad}
        />
      </Paper>
    </Paper>
  );
};

export default HistoryTicketsPanel;
