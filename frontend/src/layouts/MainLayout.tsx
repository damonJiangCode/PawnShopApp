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
          p: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <SearchBar
          onSearch={({ firstName, lastName }) => {
            setSearchFirstName(firstName);
            setSearchLastName(lastName);
          }}
          onClear={() => {}}
        />
        <SideButtons onAddClient={() => setAddClientOpen(true)} />
      </Box>
      {/* Tabs */}
      <Box sx={{ p: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Paper elevation={3}>
          <Tabs
            value={currentTab}
            onChange={(_e, newVal) => setCurrentTab(newVal)}
            variant="fullWidth"
          >
            <Tab label="Client" />
            <Tab label="Transaction" />
            <Tab label="History" />
          </Tabs>
        </Paper>

        <Box sx={{ mt: 2, flex: 1, minHeight: 0, overflow: "visible" }}>
          {currentTab === 0 && (
            <ClientPage
              searchFirstName={searchFirstName}
              searchLastName={searchLastName}
            />
          )}
          {currentTab === 1 && <TransactionPage />}
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
