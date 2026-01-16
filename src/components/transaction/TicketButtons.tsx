import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { Ticket } from "../../../shared/models/Ticket";

interface TicketButtonsrProps {
  selectedTicket: Ticket | null;
  onAdd: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onChange: () => void;
  onExpire: () => void;
}

const TicketButtons: React.FC<TicketButtonsrProps> = (props) => {
  const { selectedTicket, onAdd, onEdit, onPrint, onChange, onExpire } = props;

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
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<PrintIcon />}
        onClick={onPrint}
      >
        Print
      </Button>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<ChangeCircleIcon />}
        onClick={onChange}
      >
        Change
      </Button>
      <Button
        variant="outlined"
        fullWidth
        color="error"
        startIcon={<DeleteIcon />}
        onClick={onExpire}
      >
        Expire
      </Button>
    </Box>
  );
};

export default TicketButtons;
