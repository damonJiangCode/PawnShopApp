import React, { useEffect, useMemo, useRef, useState } from "react";
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
import type { Ticket } from "../../../../shared/types/Ticket";
import type {
  ConvertTicketInput,
  TicketFormError,
} from "../../../services/ticketService";
import { ticketService } from "../../../services/ticketService";
import { resolveFormFieldError } from "../../../utils/formError";
import { calculation } from "../../../../shared/utils/calculation";

const DEFAULT_SELL_LOCATION = "BIWK";

interface TicketConvertDialogProps {
  open: boolean;
  ticket: Ticket | null;
  clientLastName: string;
  clientFirstName: string;
  clientMiddleName?: string;
  onClose: () => void;
  onSave: (ticketData: ConvertTicketInput) => Promise<void>;
}

const TicketConvertDialog: React.FC<TicketConvertDialogProps> = ({
  open,
  ticket,
  clientLastName,
  clientFirstName,
  clientMiddleName,
  onClose,
  onSave,
}) => {
  const formattedClientName = [clientFirstName, clientMiddleName]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.toUpperCase())
    .join(" ");
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState<string[]>([]);
  const [amount, setAmount] = useState<number | "">("");
  const [oneTimeFee, setOneTimeFee] = useState<number | "">("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [oneTimeFeeError, setOneTimeFeeError] = useState("");
  const [employeePasswordError, setEmployeePasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [earlyClaimAmount, setEarlyClaimAmount] = useState(0);
  const [pickupAmount, setPickupAmount] = useState(0);

  const targetStatus = useMemo<"pawned" | "sold" | null>(() => {
    if (!ticket) {
      return null;
    }

    return ticket.status === "pawned" ? "sold" : "pawned";
  }, [ticket]);

  const directionLabel = useMemo(() => {
    if (!ticket || !targetStatus) {
      return "";
    }

    return `${ticket.status} -> ${targetStatus}`;
  }, [targetStatus, ticket]);

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
    if (!open) {
      return;
    }

    const id = requestAnimationFrame(() => {
      descriptionRef.current?.focus();
    });

    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open || !ticket || !targetStatus) {
      return;
    }

    setDescription(ticket.description || "");
    setLocation(
      targetStatus === "sold"
        ? DEFAULT_SELL_LOCATION
        : ticket.location || "",
    );
    setAmount(ticket.amount ?? "");
    setOneTimeFee(
      targetStatus === "pawned"
        ? (ticket.onetime_fee ?? "")
        : 0,
    );
    setEmployeePassword("");
    setDescriptionError("");
    setLocationError("");
    setAmountError("");
    setOneTimeFeeError("");
    setEmployeePasswordError("");
    setSubmitError("");
    setSaving(false);
  }, [open, targetStatus, ticket]);

  useEffect(() => {
    const nextAmount = typeof amount === "number" ? amount : 0;
    const nextFee = typeof oneTimeFee === "number" ? oneTimeFee : 0;
    setEarlyClaimAmount(calculation.getEarlyAmt(nextAmount, nextFee));
    setPickupAmount(calculation.getPickupAmt(nextAmount, nextFee));
  }, [amount, oneTimeFee]);

  const handleSave = async () => {
    if (!ticket || !targetStatus) {
      return;
    }

    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();
    const trimmedPassword = employeePassword.trim();
    const isValidLocation =
      locationList.length === 0 || locationList.includes(trimmedLocation);
    const nextDescriptionError =
      trimmedDescription.length === 0 ? "Description is required." : "";
    const nextLocationError =
      trimmedLocation.length === 0
        ? "Location is required."
        : !isValidLocation
          ? "Select a valid location from the list."
          : "";
    const nextEmployeePasswordError =
      trimmedPassword.length === 0 ? "Enter employee password." : "";
    const nextAmountError =
      typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0
        ? "Amount must be greater than 0."
        : "";
    const nextOneTimeFeeError =
      oneTimeFee !== "" && (!Number.isFinite(oneTimeFee) || oneTimeFee < 0)
        ? "One Time Fee cannot be negative."
        : "";

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
        target_status: targetStatus,
        description: trimmedDescription,
        location: trimmedLocation,
        amount: amount as number,
        onetime_fee: typeof oneTimeFee === "number" ? oneTimeFee : 0,
        employee_password: trimmedPassword,
      });
    } catch (err) {
      console.error(err);
      const formError = err as TicketFormError;

      const nextDescriptionFieldError = resolveFormFieldError(
        "description",
        formError,
      );
      const nextLocationFieldError = resolveFormFieldError(
        "location",
        formError,
      );
      const nextEmployeePasswordFieldError = resolveFormFieldError(
        "employee_password",
        formError,
      );
      const nextAmountFieldError = resolveFormFieldError("amount", formError);
      const nextOneTimeFeeFieldError = resolveFormFieldError(
        "onetime_fee",
        formError,
      );

      if (nextDescriptionFieldError) {
        setDescriptionError(nextDescriptionFieldError);
      }

      if (nextLocationFieldError) {
        setLocationError(nextLocationFieldError);
      }

      if (nextAmountFieldError) {
        setAmountError(nextAmountFieldError);
      }

      if (nextOneTimeFeeFieldError) {
        setOneTimeFeeError(nextOneTimeFeeFieldError);
      }

      if (nextEmployeePasswordFieldError) {
        setEmployeePasswordError(nextEmployeePasswordFieldError);
      }

      if (
        nextDescriptionFieldError ||
        nextLocationFieldError ||
        nextAmountFieldError ||
        nextOneTimeFeeFieldError ||
        nextEmployeePasswordFieldError
      ) {
        return;
      }

      setSubmitError("Couldn't convert this ticket right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Convert Ticket</DialogTitle>
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
            label="Convert"
            value={directionLabel}
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
            helperText={
              oneTimeFeeError ||
              (targetStatus === "pawned"
                ? "Optional. Leave blank to use 0."
                : "Ignored when converting to sell.")
            }
          />

          {targetStatus === "pawned" && (
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
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Convert"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketConvertDialog;
