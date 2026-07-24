import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { Item } from "../../../../../shared/models/item.model";
import { getImageDataUrl } from "../../../../shared/utils/imageDataUrl";
import { itemService } from "../../item.api";

interface TransactionItemImageProps {
  selectedItem?: Item;
  loading?: boolean;
  objectFit?: React.CSSProperties["objectFit"];
  showPlaceholderText?: boolean;
  sx?: SxProps<Theme>;
}

const TransactionItemImage: React.FC<TransactionItemImageProps> = (props) => {
  const {
    selectedItem,
    loading = false,
    objectFit = "cover",
    showPlaceholderText = true,
    sx,
  } = props;
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    setImageSrc("");

    if (!selectedItem?.image_path) {
      return;
    }

    let active = true;

    itemService.loadItemImage(selectedItem.image_path).then((base64) => {
      if (active && base64) {
        setImageSrc(getImageDataUrl(base64, selectedItem.image_path));
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
      sx={[
        {
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
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Item"
          style={{ width: "100%", height: "100%", objectFit }}
        />
      ) : selectedItem && showPlaceholderText ? (
        <Typography color="text.secondary">img area</Typography>
      ) : showPlaceholderText ? (
        <Typography color="text.secondary">Select an item</Typography>
      ) : (
        <Box />
      )}
    </Box>
  );
};

export default TransactionItemImage;
