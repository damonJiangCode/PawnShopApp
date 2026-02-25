import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import SearchBar from "../components/topbar/SearchBar";
import SideButtons from "../components/topbar/SideButtons";
import ClientPage from "../pages/ClientPage";
import TransactionPage from "../pages/TransactionPage";
import HistoryPage from "../pages/HistoryPage";
import ClientForm from "../components/client/ClientForm";
import type { Client } from "../../../shared/types/Client";

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleClientSaved = (_client: Client) => {
    setAddClientOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* TopBar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1.5,
          py: 1,
          borderBottom: "1px solid #ddd",
        }}
      >
        <SearchBar
          onSearch={({ firstName, lastName }) => {
            setSearchFirstName(firstName);
            setSearchLastName(lastName);
          }}
          onClear={() => {
            setSearchFirstName("");
            setSearchLastName("");
            setSelectedClient(null);
          }}
        />
        <SideButtons onAddClient={() => setAddClientOpen(true)} />
      </Box>
      {/* Tabs */}
      <Box sx={{ px: 1.5, pt: 1, pb: 1.5, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
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

        <Box sx={{ mt: 1, flex: 1, minHeight: 0, overflow: "hidden" }}>
          {currentTab === 0 && (
            <ClientPage
              searchFirstName={searchFirstName}
              searchLastName={searchLastName}
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
      {addClientOpen && (
        <ClientForm
          open={addClientOpen}
          onClose={() => setAddClientOpen(false)}
          onSave={handleClientSaved}
        />
      )}
    </Box>
  );
};

export default MainLayout;
