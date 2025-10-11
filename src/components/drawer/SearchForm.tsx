import React, { useState } from "react";
import { TextField, Button, Stack, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Customer } from "../../../shared/models/Customer";

interface SearchFormProps {
  onSearchResults: (customers: Customer[]) => void;
  onHasSearched: (hasSearched: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearchResults,
  onHasSearched,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSearch = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      alert("Please enter at least one name");
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const results = await (window as any).electronAPI.searchCustomer(
        firstName,
        lastName
      );
      // console.log(
      //   "Searching customer results: (SearchForm.tsx) ",
      //   JSON.stringify(results, null, 2)
      // );
      onSearchResults(results);
      onHasSearched(true);
    } catch (error) {
      console.error("Search failed: (SearchForm.tsx)", error);
      alert("Search failed (SearchForm.tsx) Please try again.");
      onSearchResults([]);
      onHasSearched(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    onSearchResults([]);
    onHasSearched(false);
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
