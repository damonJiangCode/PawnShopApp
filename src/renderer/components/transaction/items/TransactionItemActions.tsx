import React from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "../../../../shared/types/Item";
import ItemActionsLayout from "../../layout/ItemActionsLayout";
import { destructiveButtonSx } from "../../shared/actionButtonStyles";

interface TransactionItemActionsProps {
  selectedItem?: Item;
  onAdd: () => void;
  onEdit: (i: Item) => void;
  onDelete: (i: Item) => void;
}

const TransactionItemActions: React.FC<TransactionItemActionsProps> = (
  props,
) => {
  const { selectedItem, onAdd, onEdit, onDelete } = props;
  const disabled = !selectedItem;

  return (
    <ItemActionsLayout
      actions={[
        {
          label: "Add Item",
          icon: <AddIcon />,
          onClick: onAdd,
        },
        {
          label: "Edit Item",
          icon: <EditIcon />,
          disabled,
          onClick: () => selectedItem && onEdit(selectedItem),
        },
        {
          label: "Remove Item",
          icon: <DeleteIcon />,
          disabled,
          onClick: () => selectedItem && onDelete(selectedItem),
          sx: destructiveButtonSx,
        },
      ]}
    />
  );
};

export default TransactionItemActions;
