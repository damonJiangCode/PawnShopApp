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
        <Typography variant="subtitle2" color="text.secondary">
          {customer.last_name}, {customer.first_name}
        </Typography>
      )}
    </Box>
  );
};

export default CustomerBar;
