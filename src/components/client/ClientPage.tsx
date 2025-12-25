import React from "react";
import CustomerProfile from "./CustomerProfile";
import { Customer } from "../../../shared/models/Customer";
import { Paper } from "@mui/material";

interface ClientPageProps {
  customer?: Customer;
}
const ClientPage: React.FC<ClientPageProps> = (props) => {
  const { customer } = props;
  return (
    <Paper elevation={0} sx={{ m: 2, maxWidth: 1200, minHeight: 750 }}>
      {customer ? (
        <CustomerProfile customer={customer} />
      ) : (
        <div>No available customer</div>
      )}
    </Paper>
  );
};

export default ClientPage;
