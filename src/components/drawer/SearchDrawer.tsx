import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import type { Customer } from "../../../shared/customer";
import ClientAddForm from "./ClientAddForm";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";

const DRAWER_WIDTH = 330;
const COLLAPSED_WIDTH = 0;

interface SearchDrawerProps {
  isDrawerOpen?: boolean;
  onDrawerOpenChange?: (isOpen: boolean) => void;
  onCustomerSelect?: (customer: Customer) => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isDrawerOpen = true,
  onDrawerOpenChange,
  onCustomerSelect,
}) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [customerResults, setCustomerResults] = useState<Customer[] | null>(
    null
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleClear = () => {
    setCustomerResults(null);
    setHasSearched(false);
  };

  const handleDrawerToggle = () => {
    onDrawerOpenChange?.(!isDrawerOpen);
  };

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: isDrawerOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isDrawerOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
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

            <SearchForm />

            <SearchResults
              results={customerResults}
              hasSearched={hasSearched}
              onCustomerSelect={(customer: Customer) => {
                if (onCustomerSelect) onCustomerSelect(customer);
              }}
            />

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
          onSave={async (data) => {
            // TODO: 实现添加客户逻辑
            setAddDialogOpen(false);
          }}
        />
      </Dialog>
    </>
  );
};

export default SearchDrawer;
