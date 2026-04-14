import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { Item } from "../../../../shared/types/Item";

interface ItemImageProps {
  selectedItem?: Item;
  loading?: boolean;
}

const ItemImage: React.FC<ItemImageProps> = (props) => {
  const { selectedItem, loading = false } = props;

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        aspectRatio: "1 / 1",
        minWidth: 0,
        maxHeight: "100%",
        alignSelf: "center",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0.75,
        overflow: "hidden",
      }}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : selectedItem ? (
        <Typography color="text.secondary">img area</Typography>
      ) : (
        <Typography color="text.secondary">Select an item</Typography>
      )}
    </Box>
  );
};

export default ItemImage;
