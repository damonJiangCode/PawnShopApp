import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { Ticket } from "../../../shared/models/Ticket";

interface TicketButtonsrProps {
  selectedTicket?: Ticket | null;
  onAdd: () => void;
  onEdit: (t: Ticket) => void;
  onPrint: (t: Ticket) => void;
  onTransfer: (t: Ticket) => void;
  onExpire: (t: Ticket) => void;
}

const TicketButtons: React.FC<TicketButtonsrProps> = (props) => {
  const { selectedTicket, onAdd, onEdit, onPrint, onTransfer, onExpire } =
    props;
  const disabled = !selectedTicket;
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={onAdd}>
        Add
      </Button>
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => selectedTicket && onEdit(selectedTicket)}
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        startIcon={<PrintIcon />}
        onClick={() => selectedTicket && onPrint(selectedTicket)}
        disabled={disabled}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        onClick={() => selectedTicket && onTransfer(selectedTicket)}
        disabled={disabled}
      >
        Transfer
      </Button>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => selectedTicket && onExpire(selectedTicket)}
        disabled={disabled}
      >
        Expire
      </Button>
    </Box>
  );
};

export default TicketButtons;
