import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Drawer,
  CircularProgress,
  Stack,
  IconButton,
  Dialog,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { Customer } from "../../models/customer";
import ClientAddForm, {
  FormData as CustomerFormData,
} from "./drawer/ClientAddForm";

const DRAWERWIDTH = 330;
const COLLAPSED_WIDTH = 0;

interface SearchDrawerProps {
  isDrawerOpen?: boolean;
  onDrawerOpenChange?: (isOpen: boolean) => void;
  onCustomerSelect?: (customer: Customer) => void;
}

// mock data
const MOCK_CUSTOMERS: Customer[] = [
  {
    clientId: "CL-78945",
    firstName: "Michael",
    lastName: "Johnson",
    middleName: "David",
    gender: "Male",
    dateOfBirth: "1985-07-15",
    street: "123 Maple Avenue",
    city: "Toronto",
    province: "Ontario",
    country: "Canada",
    phoneNumber: "+1 (416) 555-7890",
    age: 39,
    hairColor: "Brown",
    eyeColor: "Blue",
    heightM: 1.85,
    heightFt: "6'1\"",
    weightKg: 82,
    weightLb: 180.8,
    lastPhotoUpdate: "2024-12-10",
    statistics: {
      redeemed: 28,
      expired: 3,
      stolen: 1,
      overdue: {
        current: 5,
        total: 12,
      },
    },
    identifications: [
      { type: "Driver's License", number: "DL-98765432" },
      { type: "Passport", number: "PA-123456789" },
      { type: "Health Card", number: "HC-456789123" },
    ],
  },
  {
    clientId: "CL-12345",
    firstName: "Alice",
    lastName: "Smith",
    middleName: "Marie",
    gender: "Female",
    dateOfBirth: "1990-03-22",
    street: "456 Oak Street",
    city: "Vancouver",
    province: "British Columbia",
    country: "Canada",
    phoneNumber: "+1 (604) 555-1234",
    age: 34,
    hairColor: "Black",
    eyeColor: "Brown",
    heightM: 1.68,
    heightFt: "5'6\"",
    weightKg: 60,
    weightLb: 132.3,
    lastPhotoUpdate: "2024-11-01",
    statistics: {
      redeemed: 15,
      expired: 1,
      stolen: 0,
      overdue: {
        current: 2,
        total: 4,
      },
    },
    identifications: [
      { type: "Driver's License", number: "DL-12345678" },
      { type: "Passport", number: "PA-987654321" },
    ],
  },
];

const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isDrawerOpen = true,
  onDrawerOpenChange,
  onCustomerSelect,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [customerResults, setCustomerResults] = useState<null | Customer[]>(
    null
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  const handleSearch = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      alert("Please enter at least one name");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: search client from database
    const results = MOCK_CUSTOMERS.filter(
      (c) =>
        (firstName.trim() === "" ||
          c.firstName
            .toLowerCase()
            .startsWith(firstName.trim().toLowerCase())) &&
        (lastName.trim() === "" ||
          c.lastName.toLowerCase().startsWith(lastName.trim().toLowerCase()))
    );
    setCustomerResults(results.length > 0 ? results : null);
    setHasSearched(true);
    setIsLoading(false);
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setCustomerResults(null);
    setHasSearched(false);
  };

  const handleDrawerToggle = () => {
    onDrawerOpenChange?.(!isDrawerOpen);
  };

  const handleAddCustomer = (data: CustomerFormData, ids: any[]) => {
    const newCustomer = {
      ...data,
      ids,
      id: Date.now(),
    };
    setCustomers((prev) => [...prev, newCustomer as unknown as Customer]);
    setAddDialogOpen(false);
  };

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: isDrawerOpen ? DRAWERWIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isDrawerOpen ? DRAWERWIDTH : COLLAPSED_WIDTH,
            boxSizing: "border-box",
            p: 2,
            overflowX: "hidden",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent={isDrawerOpen ? "flex-end" : "center"}
        >
          <IconButton onClick={handleDrawerToggle}>
            {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        {isDrawerOpen && (
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon />
              <Typography>Customer Search</Typography>
            </Box>

            <TextField
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              label="Last Name"
              size="small"
            />
            <TextField
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              label="First Name"
              size="small"
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearch}
                disabled={isLoading}
                startIcon={
                  isLoading ? <CircularProgress size={20} /> : <SearchIcon />
                }
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Stack>

            <Box>
              {hasSearched && customerResults && customerResults.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {/* header*/}
                  <Box
                    sx={{
                      display: "flex",
                      fontWeight: "bold",
                      borderBottom: "1px solid #ccc",
                      pb: 0.5,
                      mb: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>Last Name</Box>
                    <Box sx={{ flex: 1 }}>First Name</Box>
                  </Box>
                  {/* data rows */}
                  <Stack spacing={1}>
                    {customerResults.map((c, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          border: "1px solid #eee",
                          borderRadius: 1,
                          p: 1,
                          bgcolor: "#fafafa",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#e3f2fd" },
                        }}
                        onClick={() => onCustomerSelect?.(c)}
                      >
                        <Box sx={{ flex: 1 }}>{c.lastName}</Box>
                        <Box sx={{ flex: 1 }}>{c.firstName}</Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
              {hasSearched && customerResults === null && (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No customer found
                  </Typography>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              onClick={() => setAddDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Add Customer
            </Button>
          </Stack>
        )}
      </Drawer>
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <ClientAddForm
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSave={handleAddCustomer}
        />
      </Dialog>
    </>
  );
};

export default SearchDrawer;
