import React from "react";
import { Paper, Typography } from "@mui/material";

interface HistoryPageProps {}

const HistoryPage: React.FC<HistoryPageProps> = () => {
  return (
    <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
      <Typography color="text.secondary">History page placeholder.</Typography>
    </Paper>
  );
};

export default HistoryPage;
