import React from "react";
import { Box, Typography } from "@mui/material";
import { Customer } from "../../../shared/models/Customer";

interface CustomerBarProps {
  customer_last_name?: string;
  customer_first_name?: string;
}

const CustomerBar: React.FC<CustomerBarProps> = (props) => {
  const { customer_last_name, customer_first_name } = props;
  return (
    <Box>
      {customer_last_name && customer_first_name && (
        <Typography
          sx={{ variant: "subtitle2", color: "text.secondary", fontSize: 25 }}
        >
          {customer_last_name.toUpperCase() ?? ""}, {customer_first_name ?? ""}
        </Typography>
      )}
    </Box>
  );
};

export default CustomerBar;
