import React from "react";
import { Paper, Typography } from "@mui/material";
import type { Item } from "../../../shared/types/Item";
import { ITEM_SIDE_PANEL_WIDTH } from "../../utils/layoutSizing";
import ItemActions from "./ItemActions";
import ItemImage from "./ItemImage";

interface ItemSidePanelProps {
  selectedItem?: Item;
  loading?: boolean;
  error?: string;
  onAdd: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const ItemSidePanel: React.FC<ItemSidePanelProps> = ({
  selectedItem,
  loading = false,
  error = "",
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <Paper
      sx={{
        width: ITEM_SIDE_PANEL_WIDTH,
        minWidth: 336,
        border: "1px solid",
        borderColor: "divider",
        minHeight: 0,
        height: "100%",
        overflow: "hidden",
        flexShrink: 0,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 96px",
        alignItems: "stretch",
        columnGap: 0.75,
        p: 0.75,
      }}
    >
      <ItemImage selectedItem={selectedItem} loading={loading} />
      <ItemActions
        selectedItem={selectedItem}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default ItemSidePanel;
