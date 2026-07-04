import React from "react";
import { Box, Button } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";

interface SideButtonsProps {
  onPayment?: () => void;
}

const SideButtons: React.FC<SideButtonsProps> = ({ onPayment }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 1,
        minWidth: 116,
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
    </Box>
  );
};

export default SideButtons;
