import React, { useState } from "react";
import { AppBar, Box, IconButton, Tab, Tabs, Toolbar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SearchDrawer from "./SearchDrawer";
import ClientPage from "./ClientPage";
import TransactionComponent from "./TransactionPage";
import HistoryComponent from "./HistoryPage";

const DRAWERWIDTH = 330;
const COLLAPSED_WIDTH = 0;

const MainLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <Box display="flex">
      <SearchDrawer
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={setIsDrawerOpen}
        onCustomerSelect={setSelectedCustomer}
      />

      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            left: isDrawerOpen ? DRAWERWIDTH : COLLAPSED_WIDTH,
            transition: "left 0.3s ease-in-out",
            zIndex: 1100,
          }}
        >
          <AppBar
            position="static"
            sx={{
              backgroundColor: "#fff",
              color: "black",
              boxShadow: 1,
            }}
          >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                color="inherit"
              >
                {!isDrawerOpen && <SearchIcon />}
              </IconButton>
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
        </Box>

        <Box
          sx={{
            width: "100%",
            mt: "64px",
          }}
        >
          <Box sx={{ p: 2 }}>
            {tabIndex === 0 && <ClientPage customer={selectedCustomer} />}
            {tabIndex === 1 && <TransactionComponent />}
            {tabIndex === 2 && <HistoryComponent />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
