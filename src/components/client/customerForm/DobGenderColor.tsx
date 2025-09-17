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

  useEffect(() => {
    const fetchColors = async () => {
      const hair = await (window as any).electronAPI.getHairColors();
      setHairColors(hair);

      const eye = await (window as any).electronAPI.getEyeColors();
      setEyeColors(eye);
    };

    fetchColors();

    const todayObj = new Date();
    const maxDateObj = new Date(
      todayObj.getFullYear() - 18,
      todayObj.getMonth(),
      todayObj.getDate()
    );
    setMaxDate(maxDateObj.toISOString().split("T")[0]);
  }, []);

  const isValidDate = (d: any) => {
    return d instanceof Date && !isNaN(d.getTime());
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        required
        type="date"
        name="date_of_birth"
        label="Date of Birth"
        value={
          date_of_birth && isValidDate(new Date(date_of_birth))
            ? new Date(date_of_birth).toISOString().split("T")[0]
            : ""
        }
        onChange={onChange}
        size="small"
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: maxDate }}
        error={
          date_of_birth &&
          isValidDate(new Date(date_of_birth)) &&
          new Date(date_of_birth).toISOString().split("T")[0] > maxDate
        }
        helperText={
          date_of_birth &&
          isValidDate(new Date(date_of_birth)) &&
          new Date(date_of_birth).toISOString().split("T")[0] > maxDate
            ? `Age under 18 is not allowed`
            : ""
        }
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
        value={hair_color}
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
        value={eye_color}
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
