import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import type { TicketSearchResult } from "../../../../shared/payload-contracts/ticket.contract";
import { formatIsoDate } from "../../../shared/utils/formatters";

type TicketOwnerCheckDialogProps = {
  open: boolean;
  preview: TicketSearchResult | null;
  clientImage: string | null;
  showPickupWarnings: boolean;
  selectionConflictMessage?: string;
  confirmLabel?: string;
  paymentAmount: number;
  exceptionAmount?: number;
  onConfirm: (exceptionAmount?: number) => void;
  onClose: () => void;
};

const TicketOwnerCheckDialog: React.FC<TicketOwnerCheckDialogProps> = ({
  open,
  preview,
  clientImage,
  showPickupWarnings,
  selectionConflictMessage,
  confirmLabel = "Confirm",
  paymentAmount,
  exceptionAmount,
  onConfirm,
  onClose,
}) => {
  const [useException, setUseException] = useState(false);
  const [amount, setAmount] = useState("");
  useEffect(() => {
    if (open) {
      setUseException(exceptionAmount !== undefined);
      setAmount((exceptionAmount ?? paymentAmount).toFixed(2));
    }
  }, [open, preview?.ticket.ticket_number, paymentAmount, exceptionAmount]);
  const amountValid =
    /^\d+(\.\d{1,2})?$/.test(amount.trim()) && Number(amount) <= 99999999.99;
  const lostWarning = Boolean(showPickupWarnings && preview?.ticket.is_lost);
  const selfPickupWarning = Boolean(
    showPickupWarnings && preview?.client.pickup_self_only,
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ticket Owner Check</DialogTitle>
      <DialogContent dividers>
        {preview && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                src={clientImage ?? undefined}
                variant="rounded"
                sx={{ width: 140, height: 140, border: "1px solid #ccc" }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {selectionConflictMessage && (
                <Alert
                  severity="warning"
                  variant="outlined"
                  sx={{
                    backgroundColor: "#fff3cd",
                    borderColor: "rgba(237, 108, 2, 0.55)",
                    color: "#7a3e00",
                    fontWeight: 800,
                  }}
                >
                  {selectionConflictMessage}
                </Alert>
              )}
              {(selfPickupWarning || lostWarning) && (
                <Alert
                  severity="warning"
                  variant="outlined"
                  sx={{
                    backgroundColor: lostWarning ? "#f1ecf8" : "#fff3cd",
                    borderColor: lostWarning
                      ? "rgba(103, 80, 164, 0.5)"
                      : "rgba(237, 108, 2, 0.55)",
                    color: lostWarning ? "#4f378b" : "#7a3e00",
                    fontWeight: 800,
                    "& .MuiAlert-icon": {
                      color: lostWarning ? "#6750a4" : undefined,
                    },
                  }}
                >
                  {[
                    selfPickupWarning ? "Only this client can pick up." : "",
                    lostWarning ? "This ticket is marked as lost." : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </Alert>
              )}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Name
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    {preview.client.last_name.toUpperCase()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    First Name
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    {preview.client.first_name.toUpperCase()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Middle Name
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    {preview.client.middle_name?.toUpperCase() || "---"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    DOB
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    {formatIsoDate(preview.client.date_of_birth)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Notes
                </Typography>
                <Box
                  sx={{
                    mt: 0.5,
                    minHeight: 96,
                    maxHeight: 160,
                    overflow: "auto",
                    p: 1,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                    backgroundColor: "background.paper",
                    fontWeight: preview.client.notes ? 700 : 400,
                  }}
                >
                  {preview.client.notes || "No notes."}
                </Box>
              </Box>
              {showPickupWarnings && (
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useException}
                        onChange={(_event, checked) => setUseException(checked)}
                      />
                    }
                    label="Special pickup price (optional)"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Pickup / buyback: ${paymentAmount.toFixed(2)}. The special
                    price is saved for this pickup when you click Done.
                  </Typography>
                  {useException && (
                    <TextField
                      fullWidth
                      size="small"
                      label="Special pickup / buyback total ($)"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      inputProps={{ inputMode: "decimal" }}
                      error={!amountValid}
                      helperText={
                        amountValid
                          ? "The Buyback Report will use this amount."
                          : "Enter zero or a positive amount with up to two decimal places."
                      }
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={
            !preview || (showPickupWarnings && useException && !amountValid)
          }
          onClick={() =>
            onConfirm(
              showPickupWarnings && useException ? Number(amount) : undefined,
            )
          }
        >
          {confirmLabel}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketOwnerCheckDialog;
