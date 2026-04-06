import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import type { Ticket } from "../../../../../shared/types/Ticket";
import type {
  TicketFormError,
  UpdateTicketInput,
} from "../../../services/ticketService";
import { ticketService } from "../../../services/ticketService";
import { calculation } from "../../../../../shared/utils/calculation";
import Autocomplete from "@mui/material/Autocomplete";
import { resolveFormFieldError } from "../../../utils/formError";

interface EditTicketFormProps {
  open: boolean;
  ticket: Ticket | null;
  clientLastName: string;
  clientFirstName: string;
  onClose: () => void;
  onSave: (ticketData: UpdateTicketInput) => Promise<void>;
}

const EditTicketForm: React.FC<EditTicketFormProps> = (props) => {
  const { open, ticket, clientLastName, clientFirstName, onClose, onSave } =
    props;
  const isSellTicket = ticket?.status === "sold";
  const amountRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [oneTimeFee, setOneTimeFee] = useState<number | "">("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [locationList, setLocationList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [earlyClaimAmount, setEarlyClaimAmount] = useState(0);
  const [pickupAmount, setPickupAmount] = useState(0);
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [oneTimeFeeError, setOneTimeFeeError] = useState("");
  const [employeePasswordError, setEmployeePasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchLocations = async () => {
      setLoading(true);
      const locations = await ticketService.loadLocations();

      if (!active) {
        return;
      }

      setLocationList(locations);
      setLoading(false);
    };

    void fetchLocations();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      amountRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open || !ticket) return;
    setDescription(ticket.description || "");
    setLocation(ticket.location || "");
    setAmount(ticket.amount ?? "");
    setOneTimeFee(ticket.onetime_fee ?? "");
    setEmployeePassword("");
    setDescriptionError("");
    setLocationError("");
    setAmountError("");
    setOneTimeFeeError("");
    setEmployeePasswordError("");
    setSubmitError("");
    setSaving(false);
  }, [open, ticket]);

  useEffect(() => {
    const nextAmount = typeof amount === "number" ? amount : 0;
    const nextFee = typeof oneTimeFee === "number" ? oneTimeFee : 0;
    setEarlyClaimAmount(calculation.getEarlyAmt(nextAmount, nextFee));
    setPickupAmount(calculation.getPickupAmt(nextAmount, nextFee));
  }, [amount, oneTimeFee]);

  const handleSave = async () => {
    if (!ticket) return;

    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();
    const trimmedPassword = employeePassword.trim();
    const nextDescriptionError =
      trimmedDescription.length === 0 ? "Description is required." : "";
    const nextLocationError =
      trimmedLocation.length === 0 ? "Location is required." : "";
    const nextAmountError =
      typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0
        ? "Amount must be greater than 0."
        : "";
    const nextOneTimeFeeError =
      !isSellTicket &&
      oneTimeFee !== "" &&
      (!Number.isFinite(oneTimeFee) || oneTimeFee < 0)
        ? "One Time Fee cannot be negative."
        : "";
    const nextEmployeePasswordError =
      trimmedPassword.length === 0 ? "Enter employee password." : "";

    setDescriptionError(nextDescriptionError);
    setLocationError(nextLocationError);
    setAmountError(nextAmountError);
    setOneTimeFeeError(nextOneTimeFeeError);
    setEmployeePasswordError(nextEmployeePasswordError);
    setSubmitError("");

    if (
      nextDescriptionError ||
      nextLocationError ||
      nextAmountError ||
      nextOneTimeFeeError ||
      nextEmployeePasswordError
    ) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        ticket_number: ticket.ticket_number as number,
        description: trimmedDescription,
        location: trimmedLocation,
        amount: amount as number,
        onetime_fee: isSellTicket
          ? 0
          : typeof oneTimeFee === "number"
            ? oneTimeFee
            : 0,
        employee_password: trimmedPassword,
      });
    } catch (err) {
      console.error(err);
      const formError = err as TicketFormError;

      const nextEmployeePasswordError = resolveFormFieldError(
        "employee_password",
        formError,
      );

      if (nextEmployeePasswordError) {
        setEmployeePasswordError(nextEmployeePasswordError);
        return;
      }

      setSubmitError("Couldn't update this ticket right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Ticket</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          <TextField
            label="Client"
            value={`${clientLastName.toUpperCase()}, ${clientFirstName.toUpperCase()}`}
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
            value={description}
            onChange={(e) => {
              setDescription(e.target.value.toUpperCase().slice(0, 15));
              if (submitError) {
                setSubmitError("");
              }
              if (descriptionError) {
                setDescriptionError("");
              }
            }}
            fullWidth
            required
            error={Boolean(descriptionError)}
            helperText={descriptionError || " "}
          />
          <Autocomplete
            value={location}
            onChange={(_event, newValue) => {
              setLocation(newValue || "");
              if (submitError) {
                setSubmitError("");
              }
              if (locationError) {
                setLocationError("");
              }
            }}
            options={locationList}
            freeSolo
            disabled={loading}
            onInputChange={(_event, inputValue, reason) => {
              if (reason === "input") {
                const transformed = inputValue.replace(/[a-z]/g, (c) =>
                  c.toUpperCase(),
                );
                setLocation(transformed);
                if (submitError) {
                  setSubmitError("");
                }
                if (locationError) {
                  setLocationError("");
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                required
                fullWidth
                error={Boolean(locationError)}
                helperText={locationError || " "}
              />
            )}
          />
          <TextField
            inputRef={amountRef}
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              const nextValue = e.target.value;
              setAmount(nextValue === "" ? "" : Number(nextValue));
              if (submitError) {
                setSubmitError("");
              }
              if (amountError) {
                setAmountError("");
              }
            }}
            fullWidth
            required
            autoFocus
            error={Boolean(amountError)}
            helperText={amountError || " "}
          />
          {!isSellTicket && (
            <>
              <TextField
                label="One Time Fee"
                type="number"
                value={oneTimeFee}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setOneTimeFee(nextValue === "" ? "" : Number(nextValue));
                  if (submitError) {
                    setSubmitError("");
                  }
                  if (oneTimeFeeError) {
                    setOneTimeFeeError("");
                  }
                }}
                fullWidth
                error={Boolean(oneTimeFeeError)}
                helperText={oneTimeFeeError || "Optional. Leave blank to use 0."}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Early Claim Amount"
                  value={earlyClaimAmount.toFixed(2)}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Pickup Amount"
                  value={pickupAmount.toFixed(2)}
                  disabled
                  fullWidth
                />
              </Box>
            </>
          )}
          <TextField
            label="Employee Password"
            value={employeePassword}
            onChange={(e) => {
              setEmployeePassword(e.target.value);
              if (submitError) {
                setSubmitError("");
              }
              if (employeePasswordError) {
                setEmployeePasswordError("");
              }
            }}
            fullWidth
            required
            type="password"
            error={Boolean(employeePasswordError)}
            helperText={employeePasswordError || " "}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!ticket || saving}
        >
          Update
        </Button>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketForm;
