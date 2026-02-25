import React from "react";
import { Box, Typography } from "@mui/material";

interface InfoRowProps {
  label: string;
  value: unknown;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  let displayValue = value;

  if (value instanceof Date) {
    displayValue = value.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } else if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
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
        py: 0.8,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          flex: 2,
          color: "text.secondary",
          fontWeight: 500,
          fontSize: "0.9rem",
          textAlign: "right",
          pr: 2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          flex: 3,
          color: "text.primary",
          fontWeight: 600,
          fontSize: "1rem",
          textAlign: "right",
        }}
      >
        {renderedValue}
      </Typography>
    </Box>
  );
};

export default InfoRow;
