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
import { LOCATIONS } from "../../assets/transaction/LOCATIONS";

interface AddTicketFormProps {
  open: boolean;
  clientLastName: string;
  clientFirstName: string;
  onClose: () => void;
  onSave: (ticketData: {
    description: string;
    location: string;
    amount: number;
    oneTimeFee: number;
    employeePassword: string;
  }) => void;
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

  useEffect(() => {
    setLocationList(LOCATIONS);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        descriptionRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    const amt = typeof amount === "number" ? amount : 0;
    setEarlyClaimAmount(1.1 * amt + (oneTimeFee ? Number(oneTimeFee) : 0));
    setPickupAmount(1.3 * amt + (oneTimeFee ? Number(oneTimeFee) : 0));
  }, [amount, oneTimeFee]);

  const handleSave = () => {
    if (!description) {
      alert("Please enter the description!");
      return;
    }
    if (!location) {
      alert("Please enter the location!");
      return;
    }
    if (!amount) {
      alert("Please enter the amount!");
      return;
    }
    if (!employeePassword) {
      alert("Please enter your employee's password!");
      return;
    }

    onSave({
      description,
      location,
      amount: amount ? Number(amount) : 0,
      oneTimeFee: oneTimeFee ? Number(oneTimeFee) : 0,
      employeePassword,
    });
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
            onChange={(e) =>
              setDescription(e.target.value.toUpperCase().slice(0, 15))
            }
            fullWidth
            required
            autoFocus
          />

          <Autocomplete
            value={location}
            onChange={(_event, newValue) => setLocation(newValue || "")}
            options={locationList}
            freeSolo
            disabled={loading}
            onInputChange={(_event, inputValue, reason) => {
              if (reason === "input") {
                const transformed = inputValue.replace(/[a-z]/g, (c) =>
                  c.toUpperCase()
                );
                setLocation(transformed);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Location" required fullWidth />
            )}
          />

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            fullWidth
            required
          />

          <TextField
            label="One Time Fee"
            type="number"
            value={oneTimeFee}
            onChange={(e) =>
              setOneTimeFee(Number(e.target.value) as unknown as number)
            }
            fullWidth
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
            onChange={(e) => setEmployeePassword(e.target.value)}
            fullWidth
            required
            type="password"
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
