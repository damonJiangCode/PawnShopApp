import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import type { Item } from "../../../../shared/types/Item";
import ItemActionsLayout from "../../layout/ItemActionsLayout";

interface HistoryItemActionsProps {
  selectedItem?: Item;
  onEdit: (i: Item) => void;
}

const HistoryItemActions: React.FC<HistoryItemActionsProps> = (props) => {
  const { selectedItem, onEdit } = props;

  return (
    <ItemActionsLayout
      actions={[
        {
          label: "Edit Item",
          icon: <EditIcon />,
          disabled: !selectedItem,
          onClick: () => selectedItem && onEdit(selectedItem),
        },
      ]}
    />
  );
};

export default HistoryItemActions;
