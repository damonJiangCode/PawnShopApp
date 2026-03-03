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
import { useEffect, useRef, useState } from "react";
import InfoRow from "./InfoRow";
import STAT_COLORS from "../../../assets/client/STAT_COLORS";
import ClientForm from "../form/ClientForm";
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
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const identifications: ID[] = client.identifications || [];
  const imageSrc = useClientImage(client.image_path);

  useEffect(() => {
    if (!showPasswordForm) {
      return;
    }

    const timer = setTimeout(() => {
      passwordInputRef.current?.focus();
      passwordInputRef.current?.select();
    }, 100);

    return () => clearTimeout(timer);
  }, [showPasswordForm]);

  const handleSaveClient = async (updatedClient: Client) => {
    onClientUpdated?.(updatedClient);
    setShowEditForm(false);
  };

  const handleOpenNoteForm = () => {
    setNotesDraft(client.notes || "");
    setEmployeePassword("");
    setShowNoteForm(true);
  };

  const handleRequestSaveNote = () => {
    if (!notesDraft.trim()) {
      if ((client.notes || "").trim()) {
        handleSaveNotes(true);
      } else {
        alert("Please enter a note first.");
      }
      return;
    }
    setEmployeePassword("");
    setShowNoteForm(false);
    setShowPasswordForm(true);
  };

  const handleSaveNotes = async (skipPassword = false) => {
    if (!skipPassword && !employeePassword.trim()) {
      alert("Please enter the employee password.");
      return;
    }

    setSavingNotes(true);
    try {
      let nextNotes = "";

      if (!skipPassword) {
        const employee = await (window as any).electronAPI.verifyEmployeePassword(
          employeePassword
        );

        if (!employee) {
          alert("No employee found with that password.");
          return;
        }

        const formattedDate = new Date().toLocaleDateString("en-CA");
        nextNotes = `${notesDraft.trim()} (${employee.first_name}, ${formattedDate})`;
      }

      const updatedClient = await (window as any).electronAPI.updateClient({
        client: {
          ...client,
          notes: nextNotes,
        },
        identifications,
      });
      onClientUpdated?.(updatedClient);
      setShowPasswordForm(false);
      setShowNoteForm(false);
      setNotesDraft("");
      setEmployeePassword("");
    } catch (error) {
      console.error("Employee password verification or note update failed:", error);
      console.error("Failed to update client notes:", error);
      alert("Failed to verify employee password or update notes. Please try again.");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <Box
      sx={{
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        p: 1,
        backgroundColor: "background.paper",
        boxShadow:
          "0 0 0 3px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
        boxSizing: "border-box",
      }}
    >
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
            justifyContent: "flex-end",
            mb: 1,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenNoteForm}
          >
            Edit Note
          </Button>
        </Box>
        <Typography sx={{ whiteSpace: "pre-line" }}>
          {client.notes || "No notes available."}
        </Typography>
      </Box>

      <Dialog
        open={showNoteForm}
        onClose={() => {
          if (!savingNotes) {
            setShowNoteForm(false);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Note</DialogTitle>
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
            onClick={() => setShowNoteForm(false)}
            disabled={savingNotes}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequestSaveNote}
            variant="contained"
            disabled={savingNotes}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showPasswordForm}
        onClose={() => {
          if (!savingNotes) {
            setShowPasswordForm(false);
            setShowNoteForm(true);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Employee Password</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={passwordInputRef}
            fullWidth
            type="password"
            label="Password"
            value={employeePassword}
            onChange={(event) => setEmployeePassword(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowPasswordForm(false);
              setShowNoteForm(true);
            }}
            disabled={savingNotes}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              void handleSaveNotes();
            }}
            variant="contained"
            disabled={savingNotes}
          >
            Confirm
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
