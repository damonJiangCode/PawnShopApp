import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";

interface HeightWeightFieldsProps {
  height_cm?: number;
  weight_kg?: number;
  onHeightCmChange: (value: number | undefined) => void;
  onWeightKgChange: (value: number | undefined) => void;
}

const cmToFt = (cm: number) => cm / 30.48;
const ftToCm = (ft: number) => ft * 30.48;
const kgToLb = (kg: number) => kg * 2.20462;
const lbToKg = (lb: number) => lb / 2.20462;

const HeightWeightFields: React.FC<HeightWeightFieldsProps> = ({
  height_cm,
  weight_kg,
  onHeightCmChange,
  onWeightKgChange,
}) => {
  const [heightCmInput, setHeightCmInput] = useState<string>("");
  const [heightFtInput, setHeightFtInput] = useState<string>("");
  const [weightKgInput, setWeightKgInput] = useState<string>("");
  const [weightLbInput, setWeightLbInput] = useState<string>("");

  useEffect(() => {
    setHeightCmInput(
      height_cm !== undefined ? String(Number(height_cm).toFixed(1)) : ""
    );
    setHeightFtInput(
      height_cm !== undefined
        ? String(Number(cmToFt(height_cm)).toFixed(1))
        : ""
    );
  }, [height_cm]);

  useEffect(() => {
    setWeightKgInput(
      weight_kg !== undefined ? String(Number(weight_kg).toFixed(1)) : ""
    );
    setWeightLbInput(
      weight_kg !== undefined
        ? String(Number(kgToLb(weight_kg)).toFixed(1))
        : ""
    );
  }, [weight_kg]);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Height (cm) */}
      <TextField
        fullWidth
        type="number"
        name="height_cm"
        label="Height (cm)"
        value={heightCmInput}
        onChange={(e) => setHeightCmInput(e.target.value)}
        onBlur={() => {
          const num = Number(heightCmInput);
          if (heightCmInput === "" || isNaN(num)) {
            onHeightCmChange(undefined);
            setHeightFtInput("");
          } else {
            onHeightCmChange(num);
            setHeightFtInput(String(Number(cmToFt(num)).toFixed(2)));
          }
        }}
        size="small"
      />
      {/* Height (ft) */}
      <TextField
        fullWidth
        type="number"
        name="height_ft"
        label="Height (ft)"
        value={heightFtInput}
        onChange={(e) => setHeightFtInput(e.target.value)}
        onBlur={() => {
          const num = Number(heightFtInput);
          if (heightFtInput === "" || isNaN(num)) {
            onHeightCmChange(undefined);
            setHeightCmInput("");
          } else {
            const cm = Number(ftToCm(num).toFixed(2));
            onHeightCmChange(cm);
            setHeightCmInput(String(cm));
          }
        }}
        size="small"
      />
      {/* Weight (kg) */}
      <TextField
        fullWidth
        type="number"
        name="weight_kg"
        label="Weight (kg)"
        value={weightKgInput}
        onChange={(e) => setWeightKgInput(e.target.value)}
        onBlur={() => {
          const num = Number(weightKgInput);
          if (weightKgInput === "" || isNaN(num)) {
            onWeightKgChange(undefined);
            setWeightLbInput("");
          } else {
            onWeightKgChange(num);
            setWeightLbInput(String(Number(kgToLb(num)).toFixed(2)));
          }
        }}
        size="small"
      />
      {/* Weight (lb) */}
      <TextField
        fullWidth
        type="number"
        name="weight_lb"
        label="Weight (lb)"
        value={weightLbInput}
        onChange={(e) => setWeightLbInput(e.target.value)}
        onBlur={() => {
          const num = Number(weightLbInput);
          if (weightLbInput === "" || isNaN(num)) {
            onWeightKgChange(undefined);
            setWeightKgInput("");
          } else {
            const kg = Number(lbToKg(num).toFixed(2));
            onWeightKgChange(kg);
            setWeightKgInput(String(kg));
          }
        }}
        size="small"
      />
    </Box>
  );
};

export default HeightWeightFields;
