import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";

interface DobGenderColorProps {
  date_of_birth?: string | Date;
  gender?: string;
  hair_color?: string;
  eye_color?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const DobGenderColor: React.FC<DobGenderColorProps> = ({
  date_of_birth,
  gender,
  hair_color,
  eye_color,
  onChange,
}) => {
  const [hairColors, setHairColors] = useState<string[]>([]);
  const [eyeColors, setEyeColors] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const hair = await (window as any).electronAPI.getHairColors();
      setHairColors(hair);
      const eye = await (window as any).electronAPI.getEyeColors();
      setEyeColors(eye);
    })();
  }, []);

  // figure out the max date for 18 years ago
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // compute the date of birth value
  let dobValue = "";
  if (date_of_birth instanceof Date) {
    dobValue = date_of_birth.toISOString().split("T")[0];
  } else if (typeof date_of_birth === "string" && date_of_birth) {
    dobValue = date_of_birth;
  } else {
    dobValue = maxDate;
  }

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        required
        type="date"
        name="date_of_birth"
        label="Date of Birth"
        value={dobValue}
        onChange={onChange}
        size="small"
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: maxDate }}
      />
      <TextField
        select
        fullWidth
        required
        name="gender"
        label="Gender"
        value={gender ?? ""}
        onChange={onChange}
        size="small"
      >
        <MenuItem value=""></MenuItem>
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </TextField>
      <TextField
        select
        fullWidth
        required
        name="hair_color"
        label="Hair Color"
        value={hair_color ?? ""}
        onChange={onChange}
        size="small"
      >
        {hairColors.map((color) => (
          <MenuItem key={color} value={color}>
            {color}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        required
        name="eye_color"
        label="Eye Color"
        value={eye_color ?? ""}
        onChange={onChange}
        size="small"
      >
        {eyeColors.map((color) => (
          <MenuItem key={color} value={color}>
            {color}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default DobGenderColor;
