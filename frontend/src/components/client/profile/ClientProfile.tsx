import {
  Box,
  Typography,
  Avatar,
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
  const panelSx = {
    minWidth: 0,
    display: "flex",
    flexDirection: "column" as const,
    border: "1px solid rgba(25, 118, 210, 0.14)",
    borderRadius: 2,
    p: 1.1,
    boxShadow: 2,
    backgroundColor: "rgba(25, 118, 210, 0.03)",
    minHeight: 0,
    boxSizing: "border-box" as const,
  };

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
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 1.25,
          minHeight: 0,
        }}
      >
        <Box sx={panelSx}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              Profile
            </Typography>
            <Button
              sx={{
                minWidth: 0,
                px: 1,
                py: 0.35,
                fontSize: 11,
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
          </Box>
          {showImage && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 0.45 }}>
              <Avatar
                variant="square"
                src={imageSrc ?? undefined}
                alt="Client Photo"
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                {!client.image_path && client.first_name
                  ? client.first_name[0]
                  : ""}
              </Avatar>
            </Box>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <InfoRow label="Client #:" value={client.client_number} />
            <InfoRow label="Last Name:" value={client.last_name?.toUpperCase()} />
            <InfoRow label="First Name:" value={client.first_name?.toUpperCase()} />
            <InfoRow label="Mid Name:" value={client.middle_name?.toUpperCase()} />
            <InfoRow label="DoB:" value={client.date_of_birth} />
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
            Physical
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <InfoRow label="Gender:" value={client.gender} />
            <InfoRow label="Hair Color:" value={client.hair_color} />
            <InfoRow label="Eye Color:" value={client.eye_color} />
            <InfoRow label="Height:" value={`${client.height_cm ?? "-"} cm`} />
            <InfoRow label="Weight:" value={`${client.weight_kg ?? "-"} kg`} />
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
            Stats
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.65 }}>
            {[
              {
                label: "Redeem",
                value: client.redeem_count,
                color: STAT_COLORS.redeem,
              },
              {
                label: "Expire",
                value: client.expire_count,
                color: STAT_COLORS.expire,
              },
              {
                label: "Overdue",
                value: client.overdue_count,
                color: STAT_COLORS.overdue,
              },
              {
                label: "Theft",
                value: client.theft_count,
                color: STAT_COLORS.theft,
              },
            ].map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  borderRadius: 1.5,
                  px: 0.8,
                  py: 0.5,
                  backgroundColor: stat.color,
                  color: "#fff",
                  boxShadow: 1,
                  textAlign: "center",
                  width: "84%",
                  maxWidth: 96,
                  alignSelf: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: 0.15,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
            IDs
          </Typography>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              maxHeight: 180,
              overflow: "auto",
            }}
          >
            {identifications.length > 0 ? (
              identifications.map((element, index) => (
                <Box key={index}>
                  <InfoRow
                    label={`${element.id_type}:`}
                    value={element.id_value || "-"}
                  />
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                No identifications available.
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
            Contact
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <InfoRow label="Address:" value={client.address || "-"} />
            <InfoRow label="Postal Code:" value={client.postal_code || "-"} />
            <InfoRow label="City:" value={client.city || "-"} />
            <InfoRow label="Province:" value={client.province || "-"} />
            <InfoRow label="Country:" value={client.country || "-"} />
            <InfoRow label="Phone:" value={client.phone || "-"} />
            <InfoRow label="Email:" value={client.email || "-"} />
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.75,
              gap: 1,
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              Notes
            </Typography>
            <Button variant="outlined" size="small" onClick={handleOpenNoteForm}>
              Edit Note
            </Button>
          </Box>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              maxHeight: 180,
              overflow: "auto",
            }}
          >
            <Typography
              sx={{
                whiteSpace: "pre-line",
                fontSize: "0.92rem",
                lineHeight: 1.45,
              }}
            >
              {client.notes || "No notes available."}
            </Typography>
          </Box>
        </Box>
      </Box>

      {showEditForm && (
        <ClientForm
          clientExisted={client}
          open={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSave={handleSaveClient}
        />
      )}

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
          <Button onClick={() => setShowNoteForm(false)} disabled={savingNotes}>
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
    </Box>
  );
};

export default ClientProfile;
