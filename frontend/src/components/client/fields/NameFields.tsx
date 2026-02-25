import React from "react";
import { Box, TextField } from "@mui/material";

interface NameFieldsProps {
  lastName: string;
  firstName: string;
  middleName: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const NameFields: React.FC<NameFieldsProps> = (props) => {
  const { lastName, firstName, middleName, onChange } = props;
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        required
        name="last_name"
        label="Last Name"
        value={lastName || ""}
        onChange={onChange}
        size="small"
      />
      <TextField
        fullWidth
        required
        name="first_name"
        label="First Name"
        value={firstName || ""}
        onChange={onChange}
        size="small"
      />
      <TextField
        fullWidth
        name="middle_name"
        label="Middle Name"
        value={middleName || ""}
        onChange={onChange}
        size="small"
      />
    </Box>
  );
};

export default NameFields;
