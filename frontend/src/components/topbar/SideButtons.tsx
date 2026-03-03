import React from "react";
import { Box, Button } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";

interface SideButtonsProps {
  onSettings?: () => void;
}

const SideButtons: React.FC<SideButtonsProps> = ({ onSettings }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        minWidth: 240,
      }}
    >
      <Button variant="outlined" startIcon={<HistoryIcon />} size="small">
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
