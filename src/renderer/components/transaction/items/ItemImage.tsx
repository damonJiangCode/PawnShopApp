import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { Item } from "../../../../shared/types/Item";
import { itemService } from "../../../services/itemService";

interface ItemImageProps {
  selectedItem?: Item;
  loading?: boolean;
}

const ItemImage: React.FC<ItemImageProps> = (props) => {
  const { selectedItem, loading = false } = props;
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (!selectedItem?.image_path) {
      setImageSrc("");
      return;
    }

    let active = true;

    itemService.loadItemImage(selectedItem.image_path).then((base64) => {
      if (active && base64) {
        setImageSrc(`data:image/png;base64,${base64}`);
      }
    }).catch((err) => {
      console.error("Failed to load item image", err);
      if (active) {
        setImageSrc("");
      }
    });

    return () => {
      active = false;
    };
  }, [selectedItem?.image_path]);

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
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Item"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : selectedItem ? (
        <Typography color="text.secondary">img area</Typography>
      ) : (
        <Typography color="text.secondary">Select an item</Typography>
      )}
    </Box>
  );
};

export default ItemImage;
