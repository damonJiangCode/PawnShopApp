import React from "react";
import { Customer } from "../../../shared/models/Customer";
import TicketTable from "./TicketTable";
import { Paper } from "@mui/material";

const TransactionPage: React.FC<{ customer?: Customer }> = ({ customer }) => {
  return (
    <Paper elevation={10} sx={{ p: 5, m: 2, maxWidth: 1000, minHeight: 750 }}>
      <TicketTable />
      {/* {customer ? (
        <TicketTable />
      ) : (
        <div>No available transactions</div>
      )} */}
    </Paper>
  );
};

export default TransactionPage;
