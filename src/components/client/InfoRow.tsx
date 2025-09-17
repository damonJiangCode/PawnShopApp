import { Box, Typography } from "@mui/material";

interface InfoRowProps {
  label: string;
  value: any;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  let displayValue = value;
  if (value instanceof Date) {
    displayValue = value.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
    const date = new Date(value);
    displayValue = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  return (
    <Box sx={{ display: "flex", mb: 0.5 }}>
      <Typography
        sx={{ minWidth: 150, color: "text.secondary", fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ml: 1,
          fontSize: "1.1rem",
          color: "text.primary",
          fontWeight: 600,
        }}
      >
        {displayValue ?? ""}
      </Typography>
    </Box>
  );
};

export default InfoRow;
