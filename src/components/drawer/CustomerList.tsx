import React from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Customer } from "../../../shared/models/Customer";
import PersonIcon from "@mui/icons-material/Person";

interface CustomerListProps {
  hasSearched: boolean;
  customers: Customer[];
  onCustomerSelect: (customer: Customer) => void;
  selectedCustomer?: Customer;
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CustomerList: React.FC<CustomerListProps> = ({
  hasSearched,
  customers,
  onCustomerSelect,
  selectedCustomer,
}) => {
  if (hasSearched && customers.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          mt: 2,
          p: 2,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography color="text.secondary">
          No matching customers found
        </Typography>
      </Paper>
    );
  } else if (!hasSearched) {
    return (
      <Paper
        elevation={2}
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography color="text.secondary">
          Search for a customer to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, my: 1 }}>
        {customers.map((customer) => {
          const key = `customer-${customer.customer_number}`;

          const displayName =
            [customer.last_name || "", customer.first_name || ""]
              .filter(Boolean)
              .join(", ") || "Unnamed Customer";

          const isSelected =
            selectedCustomer?.customer_number === customer.customer_number;

          return (
            <Box key={key}>
              <Card
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  borderColor: isSelected ? "primary.main" : grey[300],
                  boxShadow: isSelected ? 3 : 0,
                  bgcolor: isSelected ? "primary.light" : "background.paper",
                  "&:hover": {
                    boxShadow: 2,
                    borderColor: isSelected ? "primary.main" : grey[400],
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => onCustomerSelect(customer)}
              >
                <CardContent
                  sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      color={
                        isSelected ? "primary.contrastText" : "text.primary"
                      }
                    >
                      {displayName}
                    </Typography>
                    <Typography
                      variant="body1"
                      color={
                        isSelected ? "primary.contrastText" : "text.secondary"
                      }
                      sx={{ mt: 0.5 }}
                    >
                      {formatDate(customer.date_of_birth)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default CustomerList;
