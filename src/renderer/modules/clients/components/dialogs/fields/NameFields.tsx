import React from "react";
import { Box, TextField } from "@mui/material";

interface NameFieldsProps {
  lastName: string;
  firstName: string;
  middleName: string;
  lastNameError?: string;
  firstNameError?: string;
  lastNameInputRef?: React.Ref<HTMLInputElement>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const NameFields: React.FC<NameFieldsProps> = (props) => {
  const {
    lastName,
    firstName,
    middleName,
    lastNameError,
    firstNameError,
    lastNameInputRef,
    onChange,
  } = props;
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        inputRef={lastNameInputRef}
        fullWidth
        required
        name="last_name"
        label="Last Name"
        value={lastName || ""}
        onChange={onChange}
        size="small"
        error={Boolean(lastNameError)}
        helperText={lastNameError || " "}
      />
      <TextField
        fullWidth
        required
        name="first_name"
        label="First Name"
        value={firstName || ""}
        onChange={onChange}
        size="small"
        error={Boolean(firstNameError)}
        helperText={firstNameError || " "}
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
