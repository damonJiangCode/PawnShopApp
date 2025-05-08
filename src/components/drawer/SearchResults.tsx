import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import type { Customer } from "../../../shared/customer";

interface SearchResultsProps {
  results: Customer[] | null;
  hasSearched: boolean;
  onCustomerSelect: (customer: Customer) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  hasSearched,
  onCustomerSelect,
}) => {
  if (!hasSearched) return null;
  if (results === null) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No customer found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
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
      <Stack spacing={1}>
        {results.map((customer) => (
          <Box
            key={customer.id}
            sx={{
              display: "flex",
              border: "1px solid #eee",
              borderRadius: 1,
              p: 1,
              bgcolor: "#fafafa",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
            onClick={() => onCustomerSelect(customer)}
          >
            <Box sx={{ flex: 1 }}>{customer.lastName}</Box>
            <Box sx={{ flex: 1 }}>{customer.firstName}</Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SearchResults;
