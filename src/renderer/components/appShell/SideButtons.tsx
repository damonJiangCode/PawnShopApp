import React from "react";
import { Box, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentsIcon from "@mui/icons-material/Payments";


interface SideButtonsProps {
  onPayment?: () => void;
  onSettings?: () => void;
}

const SideButtons: React.FC<SideButtonsProps> = ({ onPayment, onSettings }) => {
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
        variant="outlined"
        startIcon={<PaymentsIcon />}
        onClick={onPayment}
        size="small"
      >
        Payment
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
