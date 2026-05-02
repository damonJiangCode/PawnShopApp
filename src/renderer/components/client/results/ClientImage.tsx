import React from "react";
import { Box, Typography } from "@mui/material";
import type { Client } from "../../../../shared/types/Client";
import { useClientImage } from "../../../hooks/useClientImage";

interface ClientImageProps {
  client: Client | null;
}

const ClientImage: React.FC<ClientImageProps> = ({ client }) => {
  const imageSrc = useClientImage(client?.image_path);

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        aspectRatio: "1 / 1",
        minWidth: 0,
        maxHeight: "100%",
        alignSelf: "center",
        flexShrink: 0,
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0.75,
        overflow: "hidden",
      }}
    >
      {imageSrc ? (
        <Box
          component="img"
          src={imageSrc}
          alt="Client"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Typography color="text.secondary">No Image</Typography>
      )}
    </Box>
  );
};

export default ClientImage;
