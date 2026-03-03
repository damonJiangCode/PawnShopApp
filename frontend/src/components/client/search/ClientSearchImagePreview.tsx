import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import type { Client } from "../../../../../shared/types/Client";
import { useClientImage } from "../../../hooks/useClientImage";
import ClientForm from "../profile/ClientForm";

interface ClientSearchImagePreviewProps {
  client: Client | null;
  onClientUpdated?: (client: Client) => void;
}

const ClientSearchImagePreview: React.FC<ClientSearchImagePreviewProps> = ({
  client,
  onClientUpdated,
}) => {
  const imageSrc = useClientImage(client?.image_path);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Paper
      sx={{
        width: 306,
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
      <Box
        sx={{
          width: 210,
          flexShrink: 0,
          height: "100%",
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

      <Box
        sx={{
          width: 78,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2.0,
          justifyContent: "center",
        }}
      >
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{
            minWidth: 0,
            justifyContent: "flex-start",
            px: 1,
            "&:hover": {
              boxShadow: 3,
            },
          }}
        >
          Add
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          disabled={!client?.client_number}
          onClick={() => setEditOpen(true)}
          sx={{
            minWidth: 0,
            justifyContent: "flex-start",
            px: 1,
            "&:hover": {
              boxShadow: 3,
            },
          }}
        >
          Edit
        </Button>
      </Box>

      {addOpen && (
        <ClientForm
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={(createdClient) => {
            onClientUpdated?.(createdClient);
            setAddOpen(false);
          }}
        />
      )}

      {editOpen && client && (
        <ClientForm
          clientExisted={client}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={(updatedClient) => {
            onClientUpdated?.(updatedClient);
            setEditOpen(false);
          }}
        />
      )}
    </Paper>
  );
};

export default ClientSearchImagePreview;
