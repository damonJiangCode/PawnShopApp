import React, { useEffect, useState } from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import { clientService } from "../../../../services/clientService";
import {
  formatLocalIsoDatePart,
  resolveDate,
} from "../../../../utils/formatters";

interface DobGenderColorProps {
  date_of_birth?: Date | string;
  gender?: string;
  hair_color?: string;
  eye_color?: string;
  dateOfBirthError?: string;
  genderError?: string;
  hairColorError?: string;
  eyeColorError?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onDateOfBirthBlur?: () => void;
}

const DobGenderColor: React.FC<DobGenderColorProps> = ({
  date_of_birth,
  gender,
  hair_color,
  eye_color,
  dateOfBirthError,
  genderError,
  hairColorError,
  eyeColorError,
  onChange,
  onDateOfBirthBlur,
}) => {
  const [hairColors, setHairColors] = useState<string[]>([]);
  const [eyeColors, setEyeColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchColors = async () => {
      const hair = await clientService.loadHairColors();
      setHairColors(hair);

      const eye = await clientService.loadEyeColors();
      setEyeColors(eye);
    };

    fetchColors();
  }, []);

  const isValidDate = (d: unknown) =>
    d instanceof Date && !Number.isNaN(d.getTime());

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        required
        type="date"
        name="date_of_birth"
        label="Date of Birth"
        value={
          typeof date_of_birth === "string"
            ? date_of_birth
            : date_of_birth && isValidDate(resolveDate(date_of_birth))
              ? formatLocalIsoDatePart(resolveDate(date_of_birth) as Date)
              : ""
        }
        onChange={onChange}
        onBlur={onDateOfBirthBlur}
        size="small"
        InputLabelProps={{ shrink: true }}
        error={Boolean(dateOfBirthError)}
        helperText={dateOfBirthError || " "}
      />

      <TextField
        select
        fullWidth
        required
        name="gender"
        label="Gender"
        value={gender}
        onChange={onChange}
        size="small"
        error={Boolean(genderError)}
        helperText={genderError || " "}
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
        value={
          hairColors.some(
            (c) =>
              c.trim().toLowerCase() ===
              (hair_color || "").trim().toLowerCase(),
          )
            ? hair_color
            : ""
        }
        onChange={onChange}
        size="small"
        error={Boolean(hairColorError)}
        helperText={hairColorError || " "}
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
        value={
          eyeColors.some(
            (c) =>
              c.trim().toLowerCase() === (eye_color || "").trim().toLowerCase(),
          )
            ? eye_color
            : ""
        }
        onChange={onChange}
        size="small"
        error={Boolean(eyeColorError)}
        helperText={eyeColorError || " "}
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
