import React from "react";
import { Box, Typography } from "@mui/material";
import { Customer } from "../../../shared/models/Customer";

interface CustomerBarProps {
  customer?: Customer | null;
}

const CustomerBar: React.FC<CustomerBarProps> = (props) => {
  const { customer } = props;
  return (
    <Box>
      {customer && (
        <Typography
          sx={{ variant: "subtitle2", color: "text.secondary", fontSize: 25 }}
        >
          {customer.last_name.toUpperCase() ?? ""}, {customer.first_name ?? ""}
        </Typography>
      )}
    </Box>
  );
};

export default CustomerBar;
