import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBarProps {
  onSearch?: (params: { firstName: string; lastName: string }) => void;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSearch = () => {
    onSearch?.({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    onClear?.();
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        label="Last Name"
        value={lastName}
        sx={{ width: 240 }}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        label="First Name"
        value={firstName}
        sx={{ width: 240 }}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={handleSearch}
        size="medium"
      >
        Search
      </Button>

      <Button
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={handleClear}
        size="medium"
      >
        Clear
      </Button>
    </Box>
  );
};

export default SearchBar;
