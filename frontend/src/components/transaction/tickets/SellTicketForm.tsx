import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type {
  CreateSellTicketInput,
  TicketFormError,
} from "../../../services/ticketService";
import { ticketService } from "../../../services/ticketService";

interface SellTicketFormProps {
  open: boolean;
  clientLastName: string;
  clientFirstName: string;
  onClose: () => void;
  onSave: (
    ticketData: Omit<CreateSellTicketInput, "client_number">,
  ) => Promise<void>;
}

const SellTicketForm: React.FC<SellTicketFormProps> = (props) => {
  const { open, clientLastName, clientFirstName, onClose, onSave } = props;

  const descriptionRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | "">("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [amountError, setAmountError] = useState("");
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
      descriptionRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDescription("");
    setLocation("");
    setAmount("");
    setEmployeePassword("");
    setDescriptionError("");
    setLocationError("");
    setAmountError("");
    setEmployeePasswordError("");
    setSubmitError("");
    setSaving(false);
  }, [open]);

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
    const nextEmployeePasswordError =
      trimmedPassword.length === 0 ? "Password is required." : "";

    setDescriptionError(nextDescriptionError);
    setLocationError(nextLocationError);
    setAmountError(nextAmountError);
    setEmployeePasswordError(nextEmployeePasswordError);
    setSubmitError("");

    if (
      nextDescriptionError ||
      nextLocationError ||
      nextAmountError ||
      nextEmployeePasswordError
    ) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        description: trimmedDescription,
        location: trimmedLocation,
        amount: amount as number,
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
        err instanceof Error ? err.message : "Failed to sell ticket.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sell Ticket</DialogTitle>
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
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellTicketForm;
