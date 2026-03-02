import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import InfoRow from "../fields/InfoRow";
import STAT_COLORS from "../../../assets/client/STAT_COLORS";
import ClientForm from "../ClientForm";
import type { Client, ID } from "../../../../../shared/types/Client";
import { useClientImage } from "../../../hooks/useClientImage";

interface ClientProfileProps {
  client: Client;
  showImage?: boolean;
  onClientUpdated?: (client: Client) => void;
}

const ClientProfile: React.FC<ClientProfileProps> = ({
  client,
  showImage = true,
  onClientUpdated,
}) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const identifications: ID[] = client.identifications || [];
  const imageSrc = useClientImage(client.image_path);

  const handleSaveClient = async (updatedClient: Client) => {
    onClientUpdated?.(updatedClient);
    setShowEditForm(false);
  };

  const handleOpenNotesForm = () => {
    setNotesDraft(client.notes || "");
    setShowNotesForm(true);
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const updatedClient = await (window as any).electronAPI.updateClient({
        client: {
          ...client,
          notes: notesDraft,
        },
        identifications,
      });
      onClientUpdated?.(updatedClient);
      setShowNotesForm(false);
    } catch (error) {
      console.error("Failed to update client notes:", error);
      alert("Failed to update notes. Please try again.");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
          flexWrap: "wrap",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          boxShadow: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 2.5,
          }}
        >
          <Chip
            label={`Redeem: ${client.redeem_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.redeem,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Expire: ${client.expire_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.expire,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Overdue: ${client.overdue_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.overdue,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Theft: ${client.theft_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.theft,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 500 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2.5,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <InfoRow label="Last Name:" value={client.last_name?.toUpperCase()} />
              <InfoRow label="First Name:" value={client.first_name?.toUpperCase()} />
              <InfoRow label="Mid Name:" value={client.middle_name?.toUpperCase()} />
              <InfoRow label="Hair Color:" value={client.hair_color} />
              <InfoRow label="Eye Color:" value={client.eye_color} />
            </Box>

            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <InfoRow label="Client #:" value={client.client_number} />
              <InfoRow label="Gender:" value={client.gender} />
              <InfoRow label="DoB:" value={client.date_of_birth} />
              <InfoRow label="Height:" value={`${client.height_cm ?? "-"} cm`} />
              <InfoRow label="Weight:" value={`${client.weight_kg ?? "-"} kg`} />
            </Box>
          </Box>
        </Box>

        {showImage && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              minWidth: 220,
            }}
          >
            <Avatar
              variant="square"
              src={imageSrc ?? undefined}
              alt="Client Photo"
              sx={{
                mb: 1,
                width: 200,
                height: 220,
                borderRadius: 5,
                boxShadow: 8,
              }}
            >
              {!client.image_path && client.first_name
                ? client.first_name[0]
                : ""}
            </Avatar>
            <Button
              sx={{
                width: 140,
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 1,
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
              onClick={() => setShowEditForm(true)}
            >
              EDIT
            </Button>

            {showEditForm && (
              <ClientForm
                clientExisted={client}
                open={showEditForm}
                onClose={() => setShowEditForm(false)}
                onSave={handleSaveClient}
              />
            )}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          my: 2,
          boxShadow: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 1.5,
          }}
        >
          <Typography variant="h6">Notes</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenNotesForm}
          >
            Edit Notes
          </Button>
        </Box>
        <Typography>{client.notes || "No notes available."}</Typography>
      </Box>

      <Dialog
        open={showNotesForm}
        onClose={() => {
          if (!savingNotes) {
            setShowNotesForm(false);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={6}
            label="Notes"
            value={notesDraft}
            onChange={(event) => setNotesDraft(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowNotesForm(false)}
            disabled={savingNotes}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveNotes}
            variant="contained"
            disabled={savingNotes}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            boxShadow: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <InfoRow label="Address:" value={client.address || "-"} />
            <InfoRow label="Postal Code:" value={client.postal_code || "-"} />
            <InfoRow label="City:" value={client.city || "-"} />
            <InfoRow label="Province:" value={client.province || "-"} />
            <InfoRow label="Country:" value={client.country || "-"} />
            <InfoRow label="Phone:" value={client.phone || "-"} />
            <InfoRow label="Email:" value={client.email || "-"} />
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            boxShadow: 2,
          }}
        >
          {identifications.length > 0 ? (
            identifications.map((element, index) => (
              <Box key={index}>
                <InfoRow label={`${element.id_type}:`} value={element.id_value || "-"} />
              </Box>
            ))
          ) : (
            <Typography>No identifications available.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ClientProfile;
