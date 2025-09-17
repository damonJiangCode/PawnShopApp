import React from "react";
import CustomerProfile from "./CustomerProfile";
import { Customer } from "../../../shared/models/Customer";
import { Paper } from "@mui/material";

const ClientPage: React.FC<{ customer?: Customer }> = ({ customer }) => (
  <Paper elevation={10} sx={{ p: 5, m: 2, maxWidth: 1000, minHeight: 750 }}>
    {customer ? (
      <CustomerProfile customer={customer} />
    ) : (
      <div>No available customer</div>
    )}
  </Paper>
);

export default ClientPage;
