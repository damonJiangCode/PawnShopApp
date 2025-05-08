import React from "react";
import { Typography } from "@mui/material";

interface CardTitleProps {
  title: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ title }) => (
  <Typography
    variant="h6"
    gutterBottom
    sx={{
      textAlign: "center",
      fontWeight: "bold",
      color: "#1976d2",
      borderBottom: "2px solid #1976d2",
      paddingBottom: 1,
      marginBottom: 3,
      textTransform: "uppercase",
      letterSpacing: 1,
    }}
  >
    {title}
  </Typography>
);

export default CardTitle;
