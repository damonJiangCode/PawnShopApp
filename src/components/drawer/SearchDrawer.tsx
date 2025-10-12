import React, { useState } from "react";
import { Box, Drawer, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Customer, ID } from "../../../shared/models/Customer";
import SearchForm from "./SearchForm";
import CustomerList from "./CustomerList";
import CustomerForm from "../client/customer_structure/CustomerForm";

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
  onCustomerSelect: (customer: Customer) => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = (props) => {
  const { open, onClose, onCustomerSelect } = props;
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSearchResults = (customers: Customer[]) => {
    // console.log(
    //   "handleSearchResults (SearchDrawer.tsx): ",
    //   JSON.stringify(customers, null, 2)
    // );
    setSearchResults(customers);
    if (customers.length > 0) {
      setSelectedCustomer(customers[0]);
      onCustomerSelect(customers[0]);
      setHasSearched(true);
      return;
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    onCustomerSelect(customer);
  };

  const handleCustomerAdded = (customer: Customer) => {
    try {
      console.log(
        "handleCustomerAdded (SearchDrawer.tsx):",
        JSON.stringify(customer, null, 2)
      );
      handleSearchResults([customer]);
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add customer or identifications:", err);
      alert("Failed to add customer. Please try again.");
      throw err;
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 400,
          boxSizing: "border-box",
          p: 2,
        },
      }}
    >
      <SearchForm
        onSearchResults={handleSearchResults}
        onHasSearched={setHasSearched}
      />
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
        >
          Add New Customer
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <CustomerList
          hasSearched={hasSearched}
          customers={searchResults}
          onCustomerSelect={handleCustomerSelect}
          selectedCustomer={selectedCustomer}
        />
      </Box>

      <CustomerForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleCustomerAdded}
      />
    </Drawer>
  );
};

export default SearchDrawer;
