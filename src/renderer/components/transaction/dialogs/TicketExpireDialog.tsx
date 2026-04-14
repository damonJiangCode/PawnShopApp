import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { Ticket } from "../../../../shared/types/Ticket";
import type {
  ExpireTicketInput,
  TicketFormError,
} from "../../../services/ticketService";
import { resolveFormFieldError } from "../../../utils/formError";

interface TicketExpireDialogProps {
  open: boolean;
  ticket: Ticket | null;
  clientLastName: string;
  clientFirstName: string;
  clientMiddleName?: string;
  onClose: () => void;
  onSave: (ticketData: ExpireTicketInput) => Promise<void>;
}

const TicketExpireDialog: React.FC<TicketExpireDialogProps> = ({
  open,
  ticket,
  clientLastName,
  clientFirstName,
  clientMiddleName,
  onClose,
  onSave,
}) => {
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const formattedClientName = useMemo(
    () =>
      [clientFirstName, clientMiddleName]
        .filter((value): value is string => Boolean(value?.trim()))
        .map((value) => value.toUpperCase())
        .join(" "),
    [clientFirstName, clientMiddleName],
  );

  const handleSave = async () => {
    if (!ticket?.ticket_number) {
      return;
    }

    setSaving(true);
    setSubmitError("");

    try {
      await onSave({
        ticket_number: ticket.ticket_number,
      });
    } catch (err) {
      console.error(err);
      const formError = err as TicketFormError;
      const ticketNumberError = resolveFormFieldError("ticket_number", formError);

      if (ticketNumberError) {
        setSubmitError(ticketNumberError);
        return;
      }

      setSubmitError("Couldn't expire this ticket right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Expire Ticket</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          <TextField
            label="Client"
            value={`${clientLastName.toUpperCase()}, ${formattedClientName}`}
            disabled
            fullWidth
          />

          <TextField
            label="Ticket #"
            value={ticket?.ticket_number ?? ""}
            disabled
            fullWidth
          />

          <TextField
            label="Description"
            value={ticket?.description ?? ""}
            disabled
            fullWidth
          />

          <TextField
            label="Amount"
            value={ticket?.amount?.toFixed(2) ?? ""}
            disabled
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="error"
          disabled={saving}
        >
          {saving ? "Saving..." : "Expire"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketExpireDialog;
