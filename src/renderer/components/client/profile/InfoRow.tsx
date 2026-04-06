import React from "react";
import { Box, Typography } from "@mui/material";

interface InfoRowProps {
  label: string;
  value: unknown;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  let displayValue = value;
  const looksLikeDateString =
    typeof value === "string" &&
    /^\d{4}-\d{1,2}-\d{1,2}(?:[T\s].*)?$/.test(value.trim());

  if (value instanceof Date) {
    displayValue = value.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } else if (looksLikeDateString && !Number.isNaN(Date.parse(value))) {
    const date = new Date(value);
    displayValue = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  const renderedValue =
    displayValue === null || displayValue === undefined
      ? "-"
      : typeof displayValue === "string" || typeof displayValue === "number"
        ? displayValue
        : String(displayValue);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 0.45,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          flex: 2,
          color: "text.secondary",
          fontWeight: 500,
          fontSize: "0.82rem",
          textAlign: "right",
          pr: 1.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          flex: 3,
          color: "text.primary",
          fontWeight: 600,
          fontSize: "0.9rem",
          textAlign: "right",
        }}
      >
        {renderedValue}
      </Typography>
    </Box>
  );
};

export default InfoRow;
