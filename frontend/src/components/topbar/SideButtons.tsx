import React from "react";
import { Box, Button } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";

interface SideButtonsProps {
  onAddTransaction?: () => void;
  onViewHistory?: () => void;
  onSettings?: () => void;
}

const SideButtons: React.FC<SideButtonsProps> = ({
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
        minWidth: 240,
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ReceiptIcon />}
        onClick={onAddTransaction}
        size="small"
      >
        Add Ticket
      </Button>

      <Button
        variant="outlined"
        startIcon={<HistoryIcon />}
        onClick={onViewHistory}
        size="small"
      >
        History
      </Button>

      <Button
        variant="outlined"
        startIcon={<SettingsIcon />}
        onClick={onSettings}
        size="small"
      >
        Settings
      </Button>

      <Box />
    </Box>
  );
};

export default SideButtons;
