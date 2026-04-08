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
  transferDisabled?: boolean;
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
    transferDisabled = false,
    onPawn,
    onSell,
    onEdit,
    onPrint,
    onConvert,
    onTransfer,
    onExpire,
  } = props;
  const ticketActionDisabled = !selectedTicket;
  const renderButtonContent = (
    icon: React.ReactNode,
    label: string,
  ): React.ReactNode => (
    <Box
      sx={{
        width: 112,
        display: "grid",
        gridTemplateColumns: "20px 1fr",
        alignItems: "center",
        columnGap: 0.75,
      }}
    >
      <Box
        sx={{
          width: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box
        component="span"
        sx={{
          display: "block",
          textAlign: "center",
        }}
      >
        {label}
      </Box>
    </Box>
  );
  const actionButtonSx = {
    width: "100%",
    minWidth: 0,
    justifyContent: "center",
    textAlign: "center",
    color: "primary.contrastText",
    backgroundColor: "primary.main",
    "&:hover": {
      boxShadow: 3,
      backgroundColor: "primary.dark",
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
        onClick={onPawn}
      >
        {renderButtonContent(<AddIcon fontSize="small" />, "Pawn")}
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        onClick={onSell}
      >
        {renderButtonContent(<SellIcon fontSize="small" />, "Sell")}
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        onClick={onEdit}
        disabled={ticketActionDisabled}
      >
        {renderButtonContent(<EditIcon fontSize="small" />, "Edit")}
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        onClick={onPrint}
        disabled={ticketActionDisabled}
      >
        {renderButtonContent(<PrintIcon fontSize="small" />, "Prnt")}
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        onClick={onConvert}
        disabled={ticketActionDisabled}
      >
        {renderButtonContent(<AutorenewIcon fontSize="small" />, "Conv")}
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={actionButtonSx}
        onClick={onTransfer}
        disabled={transferDisabled}
      >
        {renderButtonContent(<SwapHorizIcon fontSize="small" />, "Trns")}
      </Button>
      <Button
        size="small"
        variant="contained"
        sx={destructiveButtonSx}
        onClick={onExpire}
        disabled={ticketActionDisabled}
      >
        {renderButtonContent(<DeleteIcon fontSize="small" />, "Expr")}
      </Button>
    </Box>
  );
};

export default TicketActions;
