import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import TopBar from "../components/topbar/TopBar";
import ClientPage from "../pages/ClientPage";
import TransactionPage from "../pages/TransactionPage";
import HistoryPage from "../pages/HistoryPage";
import type { Client } from "../../../shared/types/Client";

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [forcedClient, setForcedClient] = useState<Client | null>(null);

  const handleSearch = ({
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
  }) => {
    setForcedClient(null);
    setSearchFirstName(firstName);
    setSearchLastName(lastName);
  };

  const handleClear = () => {
    setForcedClient(null);
    setSearchFirstName("");
    setSearchLastName("");
    setSelectedClient(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Topbar */}
      <TopBar onSearch={handleSearch} onClear={handleClear} />

      {/* Tabs */}
      <Box
        sx={{
          px: 1.5,
          pt: 1,
          pb: 1.5,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Paper elevation={3}>
          <Tabs
            value={currentTab}
            onChange={(_e, newVal) => setCurrentTab(newVal)}
            variant="fullWidth"
            sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, py: 0.5 } }}
          >
            <Tab label="Client" />
            <Tab label="Transaction" />
            <Tab label="History" />
          </Tabs>
        </Paper>

        <Box
          sx={{
            mt: 1,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {currentTab === 0 && (
            <ClientPage
              searchFirstName={searchFirstName}
              searchLastName={searchLastName}
              forcedClient={forcedClient}
              activeClient={selectedClient}
              onClientSelected={setSelectedClient}
            />
          )}
          {currentTab === 1 && (
            <TransactionPage
              clientNumber={selectedClient?.client_number}
              clientLastName={selectedClient?.last_name}
              clientFirstName={selectedClient?.first_name}
            />
          )}
          {currentTab === 2 && <HistoryPage />}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
