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
    month: "short",
    day: "numeric",
  });
};

const CustomerList: React.FC<CustomerListProps> = (props) => {
  const { hasSearched, customers, onCustomerSelect, selectedCustomer } = props;
  // const [customerImages, setCustomerImages] = useState<{
  //   [key: number]: string;
  // }>({});

  if (hasSearched && customers.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
        <Typography color="text.secondary">
          No matching customers found
        </Typography>
      </Paper>
    );
  } else if (!hasSearched) {
    return (
      <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
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
            [
              customer.last_name.toUpperCase() || "",
              customer.first_name.toUpperCase() || "",
            ]
              .filter(Boolean)
              .join(", ") || "Unnamed Customer";
          const isSelected =
            selectedCustomer?.customer_number === customer.customer_number;
          const imagePath =
            customer.customer_number !== undefined
              ? customer.image_path
              : undefined;

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
                  <Avatar
                    src={imagePath}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: isSelected ? "primary.dark" : "grey.200",
                    }}
                  >
                    {!imagePath && <PersonIcon />}
                  </Avatar>
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
                      variant="body2"
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
