import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Client } from "../../../../../shared/types/Client";
import { useClientImage } from "../../../hooks/useClientImage";
import AddEditClientForm from "../form/AddEditClientForm";
import { deleteClient } from "../../../services/clientService";

interface ClientImagePreviewProps {
  client: Client | null;
  onClientCreated?: (client: Client) => void;
  onClientUpdated?: (client: Client) => void;
  onClientDeleted?: (clientNumber: number) => void;
}

const ClientImagePreview: React.FC<ClientImagePreviewProps> = ({
  client,
  onClientCreated,
  onClientUpdated,
  onClientDeleted,
}) => {
  const imageSrc = useClientImage(client?.image_path);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteClient = async () => {
    if (!client?.client_number) {
      return;
    }

    try {
      setDeletingClient(true);
      setDeleteError("");
      const deleted = await deleteClient(client.client_number);

      if (!deleted) {
        setDeleteError("Client could not be deleted. Please try again.");
        return;
      }

      onClientDeleted?.(client.client_number);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Failed to delete client:", error);
      setDeleteError("Failed to delete client. Please try again.");
    } finally {
      setDeletingClient(false);
    }
  };

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
        <Button
          size="small"
          variant="contained"
          startIcon={<DeleteIcon />}
          disabled={!client?.client_number}
          onClick={() => setDeleteOpen(true)}
          sx={{
            minWidth: 0,
            justifyContent: "flex-start",
            px: 1,
            "&:hover": {
              boxShadow: 3,
            },
          }}
        >
          Rmv
        </Button>
      </Box>

      {addOpen && (
        <AddEditClientForm
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={(createdClient) => {
            onClientCreated?.(createdClient);
            setAddOpen(false);
          }}
        />
      )}

      {editOpen && client && (
        <AddEditClientForm
          clientExisted={client}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={(updatedClient) => {
            onClientUpdated?.(updatedClient);
            setEditOpen(false);
          }}
        />
      )}

      <Dialog
        open={deleteOpen}
        onClose={() => {
          if (!deletingClient) {
            setDeleteOpen(false);
            setDeleteError("");
          }
        }}
      >
        <DialogTitle>Delete Client?</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Are you sure you want to delete this client?
          </Typography>
          <Typography sx={{ mt: 1 }} color="error">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteOpen(false);
              setDeleteError("");
            }}
            disabled={deletingClient}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              void handleDeleteClient();
            }}
            disabled={deletingClient}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ClientImagePreview;
