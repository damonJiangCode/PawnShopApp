import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SellIcon from "@mui/icons-material/Sell";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import type { Ticket } from "../../../../../shared/types/Ticket";

interface TicketButtonProps {
  selectedTicket: Ticket | null;
  onPawn: () => void;
  onSell: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onConvert: () => void;
  onTransfer: () => void;
  onExpire: () => void;
}

const TicketButton: React.FC<TicketButtonProps> = (props) => {
  const {
    selectedTicket,
    onPawn,
    onSell,
    onEdit,
    onPrint,
    onConvert,
    onTransfer,
    onExpire,
  } = props;
  const ticketActionDisabled = !selectedTicket;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<AddIcon />}
        onClick={onPawn}
      >
        Pawn
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<SellIcon />}
        onClick={onSell}
      >
        Sell
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<EditIcon />}
        onClick={onEdit}
        disabled={ticketActionDisabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<PrintIcon />}
        onClick={onPrint}
        disabled={ticketActionDisabled}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<AutorenewIcon />}
        onClick={onConvert}
        disabled={ticketActionDisabled}
      >
        Convert
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<SwapHorizIcon />}
        onClick={onTransfer}
        disabled={ticketActionDisabled}
      >
        Transfer
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        color="error"
        startIcon={<DeleteIcon />}
        onClick={onExpire}
        disabled={ticketActionDisabled}
      >
        Expire
      </Button>
    </Box>
  );
};

export default TicketButton;
