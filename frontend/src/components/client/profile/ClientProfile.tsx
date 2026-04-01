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
import type { Client, ID } from "../../../../../shared/types/Client";
import { useClientImage } from "../../../hooks/useClientImage";
import {
  loadEmployeeMatchByPassword,
  updateClient,
} from "../../../services/clientService";

interface ClientProfileProps {
  client: Client;
  showImage?: boolean;
  onClientUpdated?: (client: Client) => void;
  placeholder?: boolean;
}

const ClientProfile: React.FC<ClientProfileProps> = ({
  client,
  showImage = true,
  onClientUpdated,
  placeholder = false,
}) => {
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
  const displayText = (value: unknown) => {
    if (placeholder) {
      return "-";
    }

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return String(value);
  };
  const displayCount = (value: number | undefined) =>
    placeholder ? "-" : String(value ?? 0);
  const displayDate = (value: unknown) => {
    if (placeholder || !value) {
      return "-";
    }

    const parsed = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(parsed.getTime())) {
      return String(value);
    }

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };
  const displayMeasurement = (value: number | undefined, unit: string) =>
    placeholder || value === undefined ? "-" : `${value} ${unit}`;

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

  const handleOpenNoteForm = () => {
    setNotesDraft(client.notes || "");
    setEmployeePassword("");
    setShowNoteForm(true);
  };

  const handleRequestSaveNote = () => {
    const currentNotes = client.notes ?? "";
    const trimmedCurrentNotes = currentNotes.trim();
    const trimmedDraftNotes = notesDraft.trim();

    if (trimmedDraftNotes === trimmedCurrentNotes) {
      setShowNoteForm(false);
      setEmployeePassword("");
      return;
    }

    if (!trimmedDraftNotes) {
      void handleSaveNotes(true);
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
      const trimmedNotes = notesDraft.trim();
      let nextNotes = "";
      if (!skipPassword && trimmedNotes) {
        const employee =
          await loadEmployeeMatchByPassword(employeePassword);

        if (!employee) {
          alert("No employee found with that password.");
          return;
        }

        const formattedDate = new Date().toLocaleDateString("en-CA");
        nextNotes = `${trimmedNotes} (${employee.first_name}, ${formattedDate})`;
      }

      const updatedClient = await updateClient({
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
      console.error(
        "Employee password verification or note update failed:",
        error,
      );
      console.error("Failed to update client notes:", error);
      alert(
        "Failed to verify employee password or update notes. Please try again.",
      );
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <Box
      sx={{
        p: 1,
        boxSizing: "border-box",
        // border: "2px solid",
        // borderColor: "primary.main",
        // borderRadius: 2,
        // backgroundColor: "background.paper",
        // boxShadow:
        //   "0 0 0 3px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
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
            <InfoRow
              label="Client #:"
              value={displayText(client.client_number)}
            />
            <InfoRow
              label="Last Name:"
              value={displayText(client.last_name?.toUpperCase())}
            />
            <InfoRow
              label="First Name:"
              value={displayText(client.first_name?.toUpperCase())}
            />
            <InfoRow
              label="Mid Name:"
              value={displayText(client.middle_name?.toUpperCase())}
            />
            <InfoRow label="DoB:" value={displayDate(client.date_of_birth)} />
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
            Physical
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <InfoRow label="Gender:" value={displayText(client.gender)} />
            <InfoRow
              label="Hair Color:"
              value={displayText(client.hair_color)}
            />
            <InfoRow label="Eye Color:" value={displayText(client.eye_color)} />
            <InfoRow
              label="Height:"
              value={displayMeasurement(client.height_cm, "cm")}
            />
            <InfoRow
              label="Weight:"
              value={displayMeasurement(client.weight_kg, "kg")}
            />
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
                  {displayCount(stat.value)}
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
            {!placeholder && identifications.length > 0 ? (
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
                {placeholder ? "-" : "No identifications available."}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={panelSx}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
            Contact
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <InfoRow label="Address:" value={displayText(client.address)} />
            <InfoRow
              label="Postal Code:"
              value={displayText(client.postal_code)}
            />
            <InfoRow label="City:" value={displayText(client.city)} />
            <InfoRow label="Province:" value={displayText(client.province)} />
            <InfoRow label="Country:" value={displayText(client.country)} />
            <InfoRow label="Phone:" value={displayText(client.phone)} />
            <InfoRow label="Email:" value={displayText(client.email)} />
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
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenNoteForm}
              disabled={placeholder}
            >
              Edit Notes
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
              {placeholder ? "-" : client.notes || "No notes available."}
            </Typography>
          </Box>
        </Box>
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
