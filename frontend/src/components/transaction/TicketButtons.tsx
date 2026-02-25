import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import type { Ticket } from "../../../../shared/types/Ticket";

interface TicketButtonsProps {
  selectedTicket: Ticket | null;
  onAdd: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onChange: () => void;
  onExpire: () => void;
}

const TicketButtons: React.FC<TicketButtonsProps> = (props) => {
  const { selectedTicket, onAdd, onEdit, onPrint, onChange, onExpire } = props;
  const disabled = !selectedTicket;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        gap: 3,
        width: 200,
        height: 300,
      }}
    >
      <Button
        variant="outlined"
        fullWidth
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<EditIcon />}
        onClick={onEdit}
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<PrintIcon />}
        onClick={onPrint}
        disabled={disabled}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<ChangeCircleIcon />}
        onClick={onChange}
        disabled={disabled}
      >
        Change
      </Button>
      <Button
        variant="outlined"
        fullWidth
        color="error"
        startIcon={<DeleteIcon />}
        onClick={onExpire}
        disabled={disabled}
      >
        Expire
      </Button>
    </Box>
  );
};

export default TicketButtons;
