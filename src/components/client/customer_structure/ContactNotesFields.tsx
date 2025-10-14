import React from "react";
import { Box, TextField } from "@mui/material";

interface ContactNotesFieldsProps {
  email: string;
  phone: string;
  notes?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ContactNotesFields: React.FC<ContactNotesFieldsProps> = (props) => {
  const { email, phone, notes, onChange } = props;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={email || ""}
          onChange={onChange}
          size="small"
        />
        <TextField
          fullWidth
          name="phone"
          label="Phone"
          value={phone || ""}
          onChange={onChange}
          size="small"
        />
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="notes"
        label="Notes"
        value={notes || ""}
        onChange={onChange}
        size="small"
      />
    </Box>
  );
};
export default ContactNotesFields;
