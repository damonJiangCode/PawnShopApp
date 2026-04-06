import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "../../../shared/types/Item";

interface ItemActionsProps {
  selectedItem?: Item;
  onAdd: () => void;
  onEdit: (i: Item) => void;
  onDelete: (i: Item) => void;
}

const ItemActions: React.FC<ItemActionsProps> = (props) => {
  const { selectedItem, onAdd, onEdit, onDelete } = props;
  const disabled = !selectedItem;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        gap: 1,
        width: "100%",
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
        onClick={() => selectedItem && onEdit(selectedItem)}
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        fullWidth
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => selectedItem && onDelete(selectedItem)}
        disabled={disabled}
      >
        Remove
      </Button>
    </Box>
  );
};

export default ItemActions;
