import { Box, Typography, Divider } from "@mui/material";

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
        {displayValue ?? "-"}
      </Typography>
    </Box>
  );
};

export default InfoRow;
