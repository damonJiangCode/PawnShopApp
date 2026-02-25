import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";

interface SideButtonsProps {
  onAddClient?: () => void;
  onAddTransaction?: () => void;
  onViewHistory?: () => void;
  onSettings?: () => void;
}

const SideButtons: React.FC<SideButtonsProps> = ({
  onAddClient,
  onAddTransaction,
  onViewHistory,
  onSettings,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        minWidth: 260,
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClient}
      >
        Add Client
      </Button>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<ReceiptIcon />}
        onClick={onAddTransaction}
      >
        Add Ticket
      </Button>

      <Button
        variant="outlined"
        startIcon={<HistoryIcon />}
        onClick={onViewHistory}
      >
        History
      </Button>

      <Button
        variant="outlined"
        startIcon={<SettingsIcon />}
        onClick={onSettings}
      >
        Settings
      </Button>
    </Box>
  );
};

export default SideButtons;
