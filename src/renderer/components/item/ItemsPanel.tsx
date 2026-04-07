import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { Item } from "../../../shared/types/Item";
import ItemsTable from "./ItemsTable";
import ItemActions from "./ItemActions";
import ItemImage from "./ItemImage";

interface ItemsPanelProps {
  items: Item[];
  selectedItem?: Item;
  loading?: boolean;
  error?: string;
  onItemSelected: (item: Item) => void;
  onAdd: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const ItemsPanel: React.FC<ItemsPanelProps> = (props) => {
  const {
    items,
    selectedItem,
    loading = false,
    error = "",
    onItemSelected,
    onAdd,
    onEdit,
    onDelete,
  } = props;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.75,
        height: "100%",
        minHeight: 0,
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: "1 1 0", minWidth: 0, minHeight: 0 }}>
        <ItemsTable
          items={items}
          selectedItem={selectedItem}
          onItemSelected={onItemSelected}
        />
      </Box>

      <Paper
        sx={{
          flex: "0 0 350px",
          border: "1px solid",
          borderColor: "divider",
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
          flexShrink: 0,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "stretch",
          gap: 0.75,
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
    </Box>
  );
};

export default ItemsPanel;
