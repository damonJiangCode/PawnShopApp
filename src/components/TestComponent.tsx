import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Drawer,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Stack,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 300;

const TestComponent: React.FC = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [searchMode, setSearchMode] = useState<"ticket" | "name">("name");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchTicket, setSearchTicket] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNoCustomerResults, setShowNoCustomerResults] = useState(false);
  const [showNoTicketResults, setShowNoTicketResults] = useState(false);
  const [searchResults, setSearchResults] = useState<unknown[]>([]);

  const handleSearch = async () => {
    setIsLoading(true);
    setShowNoCustomerResults(false);
    // 模拟异步请求
    const res = await window.electronAPI.searchDatabase("Alice");
    console.log(res);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // 此处可根据实际逻辑设置 searchResults
    const user = await window.electronAPI.getUserInfo(123);
    console.log(user);
    setShowNoCustomerResults(true);
    setIsLoading(false);
  };

  const handleClear = () => {
    setSearchFirstName("");
    setSearchLastName("");
    setSearchTicket("");
    setSearchResults([]);
    setShowNoCustomerResults(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isLeftPanelOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            p: 2,
          },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight="bold">
            Search
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={searchMode}
            exclusive
            onChange={(_event, newValue) => {
              if (newValue !== null) {
                setSearchMode(newValue);

                if (newValue === "ticket") {
                  setShowNoCustomerResults(false);
                }
              }
            }}
            fullWidth
          >
            <ToggleButton value="name">
              <PersonIcon sx={{ mr: 1 }} />
              Name Search
            </ToggleButton>
            <ToggleButton value="ticket">
              <ConfirmationNumberIcon sx={{ mr: 1 }} />
              Ticket Search
            </ToggleButton>
          </ToggleButtonGroup>

          {searchMode === "name" ? (
            <>
              <Box>
                <TextField
                  fullWidth
                  value={searchLastName}
                  onChange={(e) => setSearchLastName(e.target.value)}
                  variant="outlined"
                  label="Last Name"
                  size="small"
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  value={searchFirstName}
                  onChange={(e) => setSearchFirstName(e.target.value)}
                  variant="outlined"
                  label="First Name"
                  size="small"
                />
              </Box>
            </>
          ) : (
            <>
              <Box>
                <TextField
                  fullWidth
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  variant="outlined"
                  label="Ticket"
                  size="small"
                />
              </Box>
            </>
          )}

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

          {showNoCustomerResults && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No results found
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Try adjusting your search criteria
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Customer
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s ease-in-out",
          ml: isLeftPanelOpen ? `${drawerWidth}px` : 0,
          p: 3,
        }}
      >
        <IconButton
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          sx={{
            position: "absolute",
            top: 16,
            left: isLeftPanelOpen ? drawerWidth - 40 : 0,
            zIndex: 1300,
          }}
        >
          {isLeftPanelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>

        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <SearchIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Select a customer to view details
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TestComponent;
