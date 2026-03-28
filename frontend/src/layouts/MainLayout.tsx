import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import TopBar from "../components/topbar/TopBar";
import ClientPage from "../pages/ClientPage";
import TransactionPage from "../pages/TransactionPage";
import HistoryPage from "../pages/HistoryPage";
import type { Client } from "../../../shared/types/Client";

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchRequestKey, setSearchRequestKey] = useState(0);
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
    setSearchRequestKey((prev) => prev + 1);
  };

  const handleClear = () => {
    setForcedClient(null);
    setSearchFirstName("");
    setSearchLastName("");
    setSearchRequestKey(0);
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
          py: 0.5,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 2.5,
            backgroundColor: "#dce8ff",
            border: "1px solid rgba(25, 118, 210, 0.22)",
            p: 0.5,
            boxShadow:
              "0 12px 32px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255,255,255,0.25) inset",
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(_e, newVal) => setCurrentTab(newVal)}
            variant="fullWidth"
            sx={{
              px: 0.35,
              pt: 0.35,
              minHeight: "unset",
              display: "flex",
              alignItems: "flex-end",
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTabs-flexContainer": {
                alignItems: "flex-end",
              },
              "& .MuiTab-root": {
                minHeight: 44,
                py: 0.75,
                px: 1.5,
                mr: 0.35,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                color: "#45658f",
                fontWeight: 700,
                textTransform: "none",
                alignSelf: "flex-end",
                transition:
                  "background-color 160ms ease, color 160ms ease, box-shadow 160ms ease",
              },
              "& .MuiTab-root:last-of-type": {
                mr: 0,
              },
              "& .MuiTab-root.Mui-selected": {
                color: "primary.dark",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(25, 118, 210, 0.14)",
                borderBottomColor: "#ffffff",
                boxShadow: "0 -1px 0 rgba(25, 118, 210, 0.16)",
                mb: "-1px",
                position: "relative",
                zIndex: 1,
              },
            }}
          >
            <Tab
              icon={<PersonOutlineIcon fontSize="small" />}
              iconPosition="start"
              label="Client"
            />
            <Tab
              icon={<ReceiptLongIcon fontSize="small" />}
              iconPosition="start"
              label="Transaction"
            />
            <Tab
              icon={<HistoryEduIcon fontSize="small" />}
              iconPosition="start"
              label="History"
            />
          </Tabs>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              mx: 0.5,
              mb: 0.5,
            }}
          >
            {currentTab === 0 && (
              <ClientPage
                searchFirstName={searchFirstName}
                searchLastName={searchLastName}
                searchRequestKey={searchRequestKey}
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
        </Paper>
      </Box>
    </Box>
  );
};

export default MainLayout;
