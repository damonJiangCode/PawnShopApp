import React from "react";
import { Box, TextField } from "@mui/material";

interface NameFieldsProps {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const NameFields: React.FC<NameFieldsProps> = ({
  lastName,
  firstName,
  middleName,
  onChange,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        required
        name="last_name"
        label="Last Name"
        value={lastName || ""}
        onChange={(e) => onChange(e)}
        size="small"
      />
      <TextField
        fullWidth
        required
        name="first_name"
        label="First Name"
        value={firstName}
        onChange={(e) => onChange(e)}
        size="small"
      />
      <TextField
        fullWidth
        name="middle_name"
        label="Middle Name"
        value={middleName}
        onChange={(e) => onChange(e)}
        size="small"
      />
    </Box>
  );
};

export default NameFields;
