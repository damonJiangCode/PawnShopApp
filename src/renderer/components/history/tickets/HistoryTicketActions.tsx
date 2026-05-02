import React from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import InputIcon from "@mui/icons-material/Input";
import type { Ticket } from "../../../../shared/types/Ticket";
import TicketActionsLayout from "../../layout/TicketActionsLayout";

interface HistoryTicketActionsProps {
  selectedTicket?: Ticket | null;
  onRepawn: () => void;
  onLoad: () => void;
}

const HistoryTicketActions: React.FC<HistoryTicketActionsProps> = ({
  selectedTicket,
  onRepawn,
  onLoad,
}) => {
  const disabled = !selectedTicket;

  return (
    <TicketActionsLayout
      actions={[
        {
          label: "Repn",
          icon: <ReplayIcon fontSize="small" />,
          disabled,
          onClick: onRepawn,
        },
        {
          label: "Load",
          icon: <InputIcon fontSize="small" />,
          disabled,
          onClick: onLoad,
        },
      ]}
    />
  );
};

export default HistoryTicketActions;
