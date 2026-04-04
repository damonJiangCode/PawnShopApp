import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import type { Ticket } from "../../../../../shared/types/Ticket";

interface TicketButtonProps {
  selectedTicket: Ticket | null;
  onAdd: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onChange: () => void;
  onExpire: () => void;
}

const TicketButton: React.FC<TicketButtonProps> = (props) => {
  const { selectedTicket, onAdd, onEdit, onPrint, onChange, onExpire } = props;
  const disabled = !selectedTicket;

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
        onClick={onAdd}
      >
        Add
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<EditIcon />}
        onClick={onEdit}
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<PrintIcon />}
        onClick={onPrint}
        disabled={disabled}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
        startIcon={<ChangeCircleIcon />}
        onClick={onChange}
        disabled={disabled}
      >
        Change
      </Button>
      <Button
        variant="outlined"
        sx={{ width: "100%" }}
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

export default TicketButton;
