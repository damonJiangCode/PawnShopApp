import React, { useEffect, useRef, useState } from "react";
import {
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
  Alert,
  FormControlLabel,
} from "@mui/material";
import type {
  CreatePawnTicketInput,
  TicketFormError,
} from "../../../services/ticketService";
import { ticketService } from "../../../services/ticketService";
import { calculation } from "../../../../../shared/utils/calculation";

interface PawnTicketFormProps {
  open: boolean;
  clientLastName: string;
  clientFirstName: string;
  onClose: () => void;
  onSave: (
    ticketData: Omit<CreatePawnTicketInput, "client_number">,
  ) => Promise<void>;
}

const PawnTicketForm: React.FC<PawnTicketFormProps> = (props) => {
  const { open, clientLastName, clientFirstName, onClose, onSave } = props;

  const descriptionRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>("");
  const [isLost, setIsLost] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [locationList, setLocationList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | "">("");
  const [oneTimeFee, setOneTimeFee] = useState<number | "">("");
  const [employeePassword, setEmployeePassword] = useState<string | "">("");
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

  // focus on description input
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      descriptionRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // initialize states
  useEffect(() => {
    if (!open) {
      return;
    }

    setDescription("");
    setIsLost(false);
    setLocation("");
    setAmount("");
    setOneTimeFee("");
    setEmployeePassword("");
    setDescriptionError("");
    setLocationError("");
    setAmountError("");
    setOneTimeFeeError("");
    setEmployeePasswordError("");
    setSubmitError("");
    setSaving(false);
  }, [open]);

  // render pickup amounts
  useEffect(() => {
    const amt = typeof amount === "number" ? amount : 0;
    const fee = typeof oneTimeFee === "number" ? oneTimeFee : 0;
    setEarlyClaimAmount(calculation.getEarlyAmt(amt, fee));
    setPickupAmount(calculation.getPickupAmt(amt, fee));
  }, [amount, oneTimeFee]);

  // handle save button clicked
  const handleSave = async () => {
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
      oneTimeFee !== "" && (!Number.isFinite(oneTimeFee) || oneTimeFee < 0)
        ? "One Time Fee cannot be negative."
        : "";
    const nextEmployeePasswordError =
      trimmedPassword.length === 0 ? "Password is required." : "";

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

    const normalizedAmount = amount as number;
    setSaving(true);

    try {
      await onSave({
        description: trimmedDescription,
        is_lost: isLost,
        location: trimmedLocation,
        amount: normalizedAmount,
        onetime_fee: typeof oneTimeFee === "number" ? oneTimeFee : 0,
        employee_password: trimmedPassword,
      });
    } catch (err) {
      console.error(err);
      const formError = err as TicketFormError;

      if (formError.field === "employee_password") {
        setEmployeePasswordError(formError.message);
        return;
      }

      setSubmitError(
        err instanceof Error ? err.message : "Failed to pawn ticket.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pawn Ticket</DialogTitle>
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
            inputRef={descriptionRef}
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
            autoFocus
            error={Boolean(descriptionError)}
            helperText={descriptionError || " "}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isLost}
                onChange={(_event, checked) => {
                  setIsLost(checked);
                }}
              />
            }
            label="Lost Ticket"
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
            error={Boolean(amountError)}
            helperText={amountError || " "}
          />

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
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          Add
        </Button>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PawnTicketForm;
