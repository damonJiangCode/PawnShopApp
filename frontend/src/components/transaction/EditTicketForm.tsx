import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import type { Ticket } from "../../../../shared/types/Ticket";
import { LOCATIONS } from "../../assets/transaction/LOCATIONS";
import Autocomplete from "@mui/material/Autocomplete";

interface EditTicketFormProps {
  open: boolean;
  ticket: Ticket | null;
  clientLastName: string;
  clientFirstName: string;
  onClose: () => void;
  onSave: (ticketData: Partial<Ticket>) => void;
}

const EditTicketForm: React.FC<EditTicketFormProps> = (props) => {
  const { open, ticket, clientLastName, clientFirstName, onClose, onSave } = props;
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [locationList, setLocationList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocationList(LOCATIONS);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!ticket) return;
    setDescription(ticket.description || "");
    setLocation(ticket.location || "");
    setAmount(ticket.amount ?? "");
  }, [ticket]);

  const handleSave = () => {
    if (!ticket) return;
    onSave({
      ticket_number: ticket.ticket_number,
      description,
      location,
      amount: typeof amount === "number" ? amount : ticket.amount,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Ticket</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
            onChange={(e) => setDescription(e.target.value.toUpperCase().slice(0, 15))}
            fullWidth
            required
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSave} disabled={!ticket}>
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketForm;
