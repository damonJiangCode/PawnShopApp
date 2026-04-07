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
  const actionButtonSx = {
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
        justifyContent: "center",
        alignItems: "stretch",
        gap: 1,
        width: "100%",
      }}
      >
      <Button
        size="small"
        variant="contained"
        fullWidth
        sx={actionButtonSx}
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add
      </Button>
      <Button
        size="small"
        variant="contained"
        fullWidth
        sx={actionButtonSx}
        startIcon={<EditIcon />}
        onClick={() => selectedItem && onEdit(selectedItem)}
        disabled={disabled}
      >
        Edt
      </Button>
      <Button
        size="small"
        variant="contained"
        fullWidth
        sx={destructiveButtonSx}
        startIcon={<DeleteIcon />}
        onClick={() => selectedItem && onDelete(selectedItem)}
        disabled={disabled}
      >
        Rmv
      </Button>
    </Box>
  );
};

export default ItemActions;
