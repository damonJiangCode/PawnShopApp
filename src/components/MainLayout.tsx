import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import TransactionComponent from "./TransactionComponent";
import HistoryComponent from "./HistoryComponent";
import ClientComponent from "./ClientComponent";

const drawerWidth = 250;
const collapsedWidth = 0;

const MainLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [searchMode, setSearchMode] = useState("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNoCustomerResults, setShowNoCustomerResults] = useState(false);
  const [showNoTicketResults, setShowNoTicketResults] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleSearch = async () => {
    if (searchMode === "name") {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // window.electronAPI.searchClient({ firstName, lastName });
      setShowNoCustomerResults(true);
    } else if (searchMode === "ticket") {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // window.electronAPI.searchTicket({ ticketNumber });
      setShowNoTicketResults(true);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    if (searchMode === "name") {
      setShowNoCustomerResults(false);
      setFirstName("");
      setLastName("");
    } else if (searchMode === "ticket") {
      setShowNoTicketResults(false);
      setTicketNumber("");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* left drawer*/}
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="persistent"
          anchor="left"
          open={isDrawerOpen}
          sx={{
            width: isDrawerOpen ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isDrawerOpen ? drawerWidth : collapsedWidth,
              p: 2,
              overflowX: "hidden",
            },
          }}
        >
          {isDrawerOpen && (
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5" fontWeight="bold">
                  Search
                </Typography>
              </Box>

              {/* Name, Ticket buttons */}
              <ToggleButtonGroup
                color="primary"
                value={searchMode}
                exclusive
                onChange={(_event, newValue) => {
                  if (newValue !== null) setSearchMode(newValue);
                }}
                fullWidth
              >
                <ToggleButton value="name">
                  <PersonIcon sx={{ mr: 1 }} />
                  Name
                </ToggleButton>
                <ToggleButton value="ticket">
                  <ConfirmationNumberIcon sx={{ mr: 1 }} />
                  Ticket
                </ToggleButton>
              </ToggleButtonGroup>

              {/* search input fields */}
              {searchMode === "name" ? (
                <>
                  <TextField
                    fullWidth
                    label="Last Name"
                    size="small"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="First Name"
                    size="small"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </>
              ) : (
                <TextField
                  fullWidth
                  label="Ticket"
                  size="small"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                />
              )}

              {/* search buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  disabled={isLoading}
                  startIcon={
                    isLoading ? <CircularProgress size={25} /> : <SearchIcon />
                  }
                >
                  {isLoading ? "" : "Search"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </Stack>

              {showNoCustomerResults && (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No customers found
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    startIcon={<PersonAddIcon />}
                  >
                    Add Customer
                  </Button>
                </Box>
              )}

              {showNoTicketResults && (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No ticket found
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </Drawer>
      </Box>

      {/* right content */}
      <Box
        display="flex"
        justifyContent={isDrawerOpen ? "flex-end" : "center"}
        sx={{
          flexGrow: 1,
          ml: isDrawerOpen ? `30px` : `${collapsedWidth}px`,
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <AppBar
            position="static"
            sx={{
              backgroundColor: "#fff",
              color: "black",
              boxShadow: 1,
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* drawer button */}
              <IconButton
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                color="inherit"
              >
                {isDrawerOpen ? <ChevronLeftIcon /> : <SearchIcon />}
              </IconButton>
              {/* tabs */}
              <Tabs
                value={tabIndex}
                onChange={(_event, newValue) => setTabIndex(newValue)}
                indicatorColor="primary"
                textColor="inherit"
                centered
              >
                <Tab
                  icon={tabIndex === 0 ? <PersonIcon /> : <PersonOutlineIcon />}
                  label="Client"
                  sx={{
                    color: tabIndex === 0 ? "primary.main" : "text.secondary",
                    "& .MuiTab-iconWrapper": {
                      color: tabIndex === 0 ? "primary.main" : "text.secondary",
                    },
                  }}
                />
                <Tab
                  icon={
                    tabIndex === 1 ? (
                      <SwapHorizontalCircleIcon />
                    ) : (
                      <SwapHorizontalCircleOutlinedIcon />
                    )
                  }
                  label="Transaction"
                  sx={{
                    color: tabIndex === 1 ? "primary.main" : "text.secondary",
                    "& .MuiTab-iconWrapper": {
                      color: tabIndex === 1 ? "primary.main" : "text.secondary",
                    },
                  }}
                />
                <Tab
                  icon={
                    tabIndex === 2 ? (
                      <WorkHistoryIcon />
                    ) : (
                      <WorkHistoryOutlinedIcon />
                    )
                  }
                  label="History"
                  sx={{
                    color: tabIndex === 2 ? "primary.main" : "text.secondary",
                    "& .MuiTab-iconWrapper": {
                      color: tabIndex === 2 ? "primary.main" : "text.secondary",
                    },
                  }}
                />
              </Tabs>
              <Box sx={{ width: 48 }} />
            </Toolbar>
          </AppBar>

          {/* tab contents */}
          <Box sx={{ p: 2 }}>
            {tabIndex === 0 && <ClientComponent />}
            {tabIndex === 1 && <TransactionComponent />}
            {tabIndex === 2 && <HistoryComponent />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
