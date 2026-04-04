import React, { useRef, useState } from "react";
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
  const lastNameInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const trimmedFirstName = String(formData.get("firstName") ?? "").trim();
    const trimmedLastName = String(formData.get("lastName") ?? "").trim();

    if (!trimmedFirstName && !trimmedLastName) {
      alert("Please enter a first name or last name to search.");
      return;
    }

    onSearch?.({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
    });
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    onClear?.();
    requestAnimationFrame(() => {
      lastNameInputRef.current?.focus();
    });
  };

  return (
    <form onSubmit={handleSearch}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          inputRef={lastNameInputRef}
          name="lastName"
          size="small"
          label="Last Name"
          value={lastName}
          sx={{ width: 240 }}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          name="firstName"
          size="small"
          label="First Name"
          value={firstName}
          sx={{ width: 240 }}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <Button
          type="submit"
          size="small"
          variant="contained"
          startIcon={<SearchIcon />}
        >
          Search
        </Button>

        <Button
          size="small"
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClear}
        >
          Clear
        </Button>
      </Box>
    </form>
  );
};

export default SearchBar;
