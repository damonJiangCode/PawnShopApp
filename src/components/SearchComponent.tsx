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
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const drawerWidth = 330;
const collapsedWidth = 0;

type Customer = {
  firstName: string;
  lastName: string;
};

interface SearchComponentProps {
  isDrawerOpen?: boolean;
  onDrawerOpenChange?: (isOpen: boolean) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  isDrawerOpen = true,
  onDrawerOpenChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [customerResults, setCustomerResults] = useState<null | Customer[]>(
    null
  );

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      if (!firstName.trim() && !lastName.trim()) {
        alert("Please enter at least one name");
        throw new Error("Please enter at least one name");
      }
      setHasSearched(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: 这里是实际的 API 调用
      // const results = await searchCustomers({ firstName, lastName });
      setCustomerResults(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
      sx={{
        width: isDrawerOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isDrawerOpen ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          p: 2,
          overflowX: "hidden",
        },
      }}
    >
      <Box display="flex" justifyContent={isDrawerOpen ? "flex-end" : "center"}>
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

          {hasSearched && customerResults === null && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No customer found
              </Typography>
            </Box>
          )}

          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Customer
          </Button>
        </Stack>
      )}
    </Drawer>
  );
};

export default SearchComponent;
