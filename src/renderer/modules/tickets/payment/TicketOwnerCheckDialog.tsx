import React from "react";
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
} from "@mui/material";
import type { TicketSearchResult } from "../../../../shared/types/ticketApiTypes";
import { formatIsoDate } from "../../../shared/utils/formatters";

type TicketOwnerCheckDialogProps = {
  open: boolean;
  preview: TicketSearchResult | null;
  clientImage: string | null;
  onConfirm: () => void;
  onClose: () => void;
};

const TicketOwnerCheckDialog: React.FC<TicketOwnerCheckDialogProps> = ({
  open,
  preview,
  clientImage,
  onConfirm,
  onClose,
}) => (
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
            {(preview.client.pickup_self_only || preview.ticket.is_lost) && (
              <Alert severity="warning" variant="filled">
                {[
                  preview.client.pickup_self_only
                    ? "Only this client can pick up."
                    : "",
                  preview.ticket.is_lost
                    ? "This ticket is marked as lost."
                    : "",
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
                  border: "1px solid #d0d7de",
                  borderRadius: 1,
                  whiteSpace: "pre-wrap",
                  backgroundColor: "#fff",
                  fontWeight: preview.client.notes ? 700 : 400,
                }}
              >
                {preview.client.notes || "No notes."}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button variant="contained" onClick={onConfirm}>
        Confirm
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default TicketOwnerCheckDialog;
