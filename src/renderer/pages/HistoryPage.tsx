import React from "react";
import { Paper } from "@mui/material";

interface HistoryPageProps {}
const HistoryPage: React.FC<HistoryPageProps> = () => {
  return (
    <Paper elevation={0} sx={{ m: 2, maxWidth: 1200, minHeight: 750 }}>
      HISTORY PAGE
    </Paper>
  );
};

export default HistoryPage;
