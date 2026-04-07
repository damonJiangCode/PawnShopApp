import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SellIcon from "@mui/icons-material/Sell";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import type { Ticket } from "../../../shared/types/Ticket";

interface TicketActionsProps {
  selectedTicket: Ticket | null;
  onPawn: () => void;
  onSell: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onConvert: () => void;
  onTransfer: () => void;
  onExpire: () => void;
}

const TicketActions: React.FC<TicketActionsProps> = (props) => {
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
  const actionButtonSx = {
    width: "100%",
    minWidth: 0,
    justifyContent: "center",
    color: "primary.contrastText",
    backgroundColor: "primary.main",
    "&:hover": {
      boxShadow: 3,
      backgroundColor: "primary.dark",
    },
    "& .MuiButton-startIcon": {
      marginRight: 3,
      marginLeft: 0,
    },
    "&.Mui-disabled": {
      color: "rgba(15, 23, 42, 0.38)",
      backgroundColor: "rgba(148, 163, 184, 0.22)",
      borderColor: "transparent",
    },
  } as const;
  const destructiveButtonSx = {
    ...actionButtonSx,
    color: "error.contrastText",
    backgroundColor: "error.main",
    "&:hover": {
      boxShadow: 3,
      backgroundColor: "error.dark",
    },
    "&.Mui-disabled": {
      color: "rgba(127, 29, 29, 0.42)",
      backgroundColor: "rgba(248, 113, 113, 0.18)",
      borderColor: "transparent",
    },
    "& .MuiButton-startIcon": {
      marginRight: 3,
      marginLeft: 0,
    },
  } as const;

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
        size="small"
        variant="contained"
        sx={actionButtonSx}
        startIcon={<AddIcon />}
        onClick={onPawn}
      >
        Pawn
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        startIcon={<SellIcon />}
        onClick={onSell}
      >
        Sell
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        startIcon={<EditIcon />}
        onClick={onEdit}
        disabled={ticketActionDisabled}
      >
        Edit
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        startIcon={<PrintIcon />}
        onClick={onPrint}
        disabled={ticketActionDisabled}
      >
        Print
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        startIcon={<AutorenewIcon />}
        onClick={onConvert}
        disabled={ticketActionDisabled}
      >
        Convert
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        startIcon={<SwapHorizIcon />}
        onClick={onTransfer}
        disabled={ticketActionDisabled}
      >
        Transfer
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={destructiveButtonSx}
        startIcon={<DeleteIcon />}
        onClick={onExpire}
        disabled={ticketActionDisabled}
      >
        Expire
      </Button>
    </Box>
  );
};

export default TicketActions;
