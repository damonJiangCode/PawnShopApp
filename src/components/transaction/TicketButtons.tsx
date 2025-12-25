import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { Ticket } from "../../../shared/models/Ticket";

interface TicketButtonsrProps {
  selectedTicket?: Ticket;
  onAdd: () => void;
  onEdit: (t: Ticket) => void;
  onPrint: (t: Ticket) => void;
  onChange: (t: Ticket) => void;
  onExpire: (t: Ticket) => void;
}

const TicketButtons: React.FC<TicketButtonsrProps> = (props) => {
  const { selectedTicket, onAdd, onEdit, onPrint, onChange, onExpire } = props;
  const disabled = !selectedTicket;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        width: 200,
      }}
    >
      <Button
        variant="outlined"
        fullWidth
        startIcon={<AddIcon />}
        onClick={() => onAdd()}
      >
        Add
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<EditIcon />}
        onClick={() => selectedTicket && onEdit(selectedTicket)}
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<PrintIcon />}
        onClick={() => selectedTicket && onPrint(selectedTicket)}
        disabled={disabled}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<ChangeCircleIcon />}
        onClick={() => selectedTicket && onChange(selectedTicket)}
        disabled={disabled}
      >
        Change
      </Button>
      <Button
        variant="outlined"
        fullWidth
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
