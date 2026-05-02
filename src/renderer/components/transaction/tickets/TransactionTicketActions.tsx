import React from "react";
import AddIcon from "@mui/icons-material/Add";
import SellIcon from "@mui/icons-material/Sell";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import type { Ticket } from "../../../../shared/types/Ticket";
import TicketActionsLayout from "../../layout/TicketActionsLayout";
import { destructiveButtonSx } from "../../shared/actionButtonStyles";

interface TransactionTicketActionsProps {
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

const TransactionTicketActions: React.FC<TransactionTicketActionsProps> = (props) => {
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

  return (
    <TicketActionsLayout
      justifyContent="space-between"
      actions={[
        {
          label: "Pawn",
          icon: <AddIcon fontSize="small" />,
          onClick: onPawn,
        },
        {
          label: "Sell",
          icon: <SellIcon fontSize="small" />,
          onClick: onSell,
        },
        {
          label: "Edit",
          icon: <EditIcon fontSize="small" />,
          disabled: ticketActionDisabled,
          onClick: onEdit,
        },
        {
          label: "Prnt",
          icon: <PrintIcon fontSize="small" />,
          disabled: ticketActionDisabled,
          onClick: onPrint,
        },
        {
          label: "Conv",
          icon: <AutorenewIcon fontSize="small" />,
          disabled: ticketActionDisabled,
          onClick: onConvert,
        },
        {
          label: "Trns",
          icon: <SwapHorizIcon fontSize="small" />,
          disabled: transferDisabled,
          onClick: onTransfer,
        },
        {
          label: "Expr",
          icon: <DeleteIcon fontSize="small" />,
          disabled: ticketActionDisabled,
          onClick: onExpire,
          sx: destructiveButtonSx,
        },
      ]}
    />
  );
};

export default TransactionTicketActions;
