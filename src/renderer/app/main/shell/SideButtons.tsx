import React from "react";
import { Box, Button } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";

interface SideButtonsProps {
  onPayment?: () => void;
  onTicketSearch?: () => void;
  onItemSearch?: () => void;
}

const SideButtons: React.FC<SideButtonsProps> = ({
  onPayment,
  onTicketSearch,
  onItemSearch,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(88px, 1fr))",
        gap: 0.75,
        flex: "0 0 288px",
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
        startIcon={<ReceiptLongIcon />}
        onClick={onTicketSearch}
        size="small"
      >
        Ticket
      </Button>
      <Button
        variant="outlined"
        startIcon={<Inventory2Icon />}
        onClick={onItemSearch}
        size="small"
      >
        Item
      </Button>
    </Box>
  );
};

export default SideButtons;
