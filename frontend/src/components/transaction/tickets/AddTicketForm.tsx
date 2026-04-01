import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
} from "@mui/material";
import { LOCATIONS } from "../../../assets/transaction/LOCATIONS";
import type { FormFieldError } from "../../../services/transactionService";
import { calculation } from "../../../../../shared/utils/calculation";

interface AddTicketFormProps {
  open: boolean;
  clientLastName: string;
  clientFirstName: string;
  onClose: () => void;
  onSave: (ticketData: {
    description: string;
    location: string;
    amount: number;
    onetime_fee: number;
    employee_password: string;
  }) => Promise<void>;
}

const AddTicketForm: React.FC<AddTicketFormProps> = (props) => {
  const { open, clientLastName, clientFirstName, onClose, onSave } = props;

  const descriptionRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>("");
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

  // render locations
  useEffect(() => {
    setLocationList(LOCATIONS);
    setLoading(false);
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
    setLocation("");
    setAmount("");
    setOneTimeFee("");
    setEmployeePassword("");
    setDescriptionError("");
    setLocationError("");
    setAmountError("");
    setOneTimeFeeError("");
    setEmployeePasswordError("");
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

    try {
      await onSave({
        description: trimmedDescription,
        location: trimmedLocation,
        amount: normalizedAmount,
        onetime_fee: typeof oneTimeFee === "number" ? oneTimeFee : 0,
        employee_password: trimmedPassword,
      });
    } catch (err) {
      console.error(err);
      const formError = err as FormFieldError;

      if (formError.field === "employee_password") {
        setEmployeePasswordError(formError.message);
        return;
      }

      alert(err instanceof Error ? err.message : "Failed to add ticket!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Ticket</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
              if (oneTimeFeeError) {
                setOneTimeFeeError("");
              }
            }}
            fullWidth
            error={Boolean(oneTimeFeeError)}
            helperText={oneTimeFeeError || " "}
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
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTicketForm;
