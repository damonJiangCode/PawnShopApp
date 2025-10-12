import React, { useState } from "react";
import { Box, IconButton, Tabs, Tab, Paper } from "@mui/material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HistoryIcon from "@mui/icons-material/History";
import SearchDrawer from "./components/drawer/SearchDrawer";
import { Customer } from "../shared/models/Customer";
import ClientPage from "./components/client/ClientPage";
import TransactionPage from "./components/transaction/TransactionPage";
import HistoryPage from "./components/history/HistoryPage";
import TabPanel from "./components/others/TabPanel";

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box sx={{ p: 2 }}>
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{ position: "fixed", top: 16, left: 16 }}
      >
        <DehazeIcon />
      </IconButton>

      <SearchDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCustomerSelect={(customer: Customer) => {
          setSelectedCustomer(customer);
        }}
      />

      <Box sx={{ mt: 2, p: 2 }}>
        <Paper elevation={3}>
          <Tabs
            value={currentTab}
            onChange={(_event: React.SyntheticEvent, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                py: 1,
                minHeight: 50,
                fontSize: "1rem",
                textTransform: "none",
                fontWeight: 700,
              },
              "& .Mui-selected": {
                bgcolor: "primary.light",
                color: "primary.main",
                "& .MuiSvgIcon-root": {
                  color: "primary.main",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
              },
            }}
          >
            <Tab
              icon={<PersonIcon sx={{ fontSize: 28 }} />}
              label="Client"
              iconPosition="start"
            />
            <Tab
              icon={<ReceiptIcon sx={{ fontSize: 28 }} />}
              label="Transaction"
              iconPosition="start"
            />
            <Tab
              icon={<HistoryIcon sx={{ fontSize: 28 }} />}
              label="History"
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        <TabPanel value={currentTab} index={0}>
          <ClientPage customer={selectedCustomer} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <TransactionPage />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <HistoryPage />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default App;

// import ComponentPreview from "./components/ComponentPreview";

// function App() {
//   return <ComponentPreview />;
// }

// export default App;
