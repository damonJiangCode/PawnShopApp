import React, { useState } from "react";
import { TextField, Button, Stack, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSearch = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      alert("Please enter at least one name");
      return;
    }

    setIsLoading(true);
    // TODO: Implement search functionality
    // try {
    //   const results = await window.electronAPI.searchCustomers(
    //     firstName,
    //     lastName
    //   );
    //   console.log(results);
    // } catch (error) {
    //   console.error("Search failed:", error);
    //   alert("Search failed. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
  };

  return (
    <Stack spacing={2}>
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
    </Stack>
  );
};

export default SearchForm;
