import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";

interface HeightWeightFieldsProps {
  height_cm?: number;
  weight_kg?: number;
  onHeightCmChange: (value: number | undefined) => void;
  onWeightKgChange: (value: number | undefined) => void;
}

const HeightWeightFields: React.FC<HeightWeightFieldsProps> = ({
  height_cm,
  weight_kg,
  onHeightCmChange,
  onWeightKgChange,
}) => {
  const [heightFt, setHeightFt] = useState<number | "">("");
  const [weightLb, setWeightLb] = useState<number | "">("");
  const [editing, setEditing] = useState<"cm" | "ft" | "kg" | "lb" | null>(
    null
  );

  // cm → ft
  useEffect(() => {
    if (editing === "ft") return;
    if (height_cm !== undefined && !isNaN(height_cm)) {
      const ft = Number((height_cm / 30.48).toFixed(2));
      setHeightFt(ft);
    } else {
      setHeightFt("");
    }
  }, [height_cm, editing]);

  // kg → lb
  useEffect(() => {
    if (editing === "lb") return;
    if (weight_kg !== undefined && !isNaN(weight_kg)) {
      const lb = Number((weight_kg * 2.20462).toFixed(2));
      setWeightLb(lb);
    } else {
      setWeightLb("");
    }
  }, [weight_kg, editing]);

  // ft → cm
  useEffect(() => {
    if (editing !== "ft") return;
    if (heightFt === "" || isNaN(Number(heightFt))) {
      onHeightCmChange(undefined);
    } else {
      const cm = Number((Number(heightFt) * 30.48).toFixed(2));
      onHeightCmChange(cm);
    }
  }, [heightFt, editing]);

  // lb → kg
  useEffect(() => {
    if (editing !== "lb") return;
    if (weightLb === "" || isNaN(Number(weightLb))) {
      onWeightKgChange(undefined);
    } else {
      const kg = Number((Number(weightLb) / 2.20462).toFixed(2));
      onWeightKgChange(kg);
    }
  }, [weightLb, editing]);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        required
        fullWidth
        type="number"
        name="height_cm"
        label="Height (cm)"
        value={height_cm ?? ""}
        onChange={(e) => {
          setEditing("cm");
          const val = parseFloat(e.target.value);
          onHeightCmChange(isNaN(val) ? undefined : val);
        }}
        onBlur={() => setEditing(null)}
        size="small"
      />
      <TextField
        fullWidth
        type="number"
        name="height_ft"
        label="Height (ft)"
        value={heightFt}
        onChange={(e) => {
          setEditing("ft");
          const val = parseFloat(e.target.value);
          setHeightFt(isNaN(val) ? "" : val);
        }}
        onBlur={() => setEditing(null)}
        size="small"
      />
      <TextField
        required
        fullWidth
        type="number"
        name="weight_kg"
        label="Weight (kg)"
        value={weight_kg ?? ""}
        onChange={(e) => {
          setEditing("kg");
          const val = parseFloat(e.target.value);
          onWeightKgChange(isNaN(val) ? undefined : val);
        }}
        onBlur={() => setEditing(null)}
        size="small"
      />
      <TextField
        fullWidth
        type="number"
        name="weight_lb"
        label="Weight (lb)"
        value={weightLb}
        onChange={(e) => {
          setEditing("lb");
          const val = parseFloat(e.target.value);
          setWeightLb(isNaN(val) ? "" : val);
        }}
        onBlur={() => setEditing(null)}
        size="small"
      />
    </Box>
  );
};

export default HeightWeightFields;
