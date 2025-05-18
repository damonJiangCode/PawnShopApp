import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";

interface DobGenderColorProps {
  date_of_birth?: Date;
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
  const [maxDate, setMaxDate] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value > maxDate) {
      onChange({
        target: { name, value: maxDate },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      onChange(e);
    }
  };

  useEffect(() => {
    const fetchColors = async () => {
      const hair = await (window as any).electronAPI.getHairColors();
      setHairColors(hair);

      const eye = await (window as any).electronAPI.getEyeColors();
      setEyeColors(eye);
    };

    fetchColors();

    const today = new Date();
    const maxDateObj = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    setMaxDate(maxDateObj.toISOString().split("T")[0]);
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        required
        type="date"
        name="date_of_birth"
        label="Date of Birth"
        value={date_of_birth ?? ""}
        onChange={handleDateChange}
        size="small"
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: maxDate }}
        error={
          date_of_birth !== undefined &&
          new Date(date_of_birth).toISOString().split("T")[0] > maxDate
        }
        helperText={
          date_of_birth !== undefined &&
          new Date(date_of_birth).toISOString().split("T")[0] > maxDate
            ? `Date must be before ${maxDate}`
            : ""
        }
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
