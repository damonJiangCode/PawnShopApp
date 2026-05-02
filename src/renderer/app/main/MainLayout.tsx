import React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import TopBar from "../../components/appShell/TopBar";
import ClientPage from "../../pages/ClientPage";
import TransactionPage from "../../pages/TransactionPage";
import HistoryPage from "../../pages/HistoryPage";
import { useMainLayoutState } from "./useMainLayoutState";

interface MainTabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

const MainTabPanel: React.FC<MainTabPanelProps> = ({ active, children }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        height: "100%",
        visibility: active ? "visible" : "hidden",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {children}
    </Box>
  );
};

const MainLayout: React.FC = () => {
  const { state, actions } = useMainLayoutState();
  const {
    currentTab,
    searchFirstName,
    searchLastName,
    searchRequestKey,
    selectedClient,
    forcedClient,
    selectedTransactionTicket,
    incomingTransactionTicket,
    incomingItemLoadRequest,
    focusTicketNumber,
    focusRequestId,
  } = state;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar
        onSearch={actions.handleSearch}
        onClear={actions.handleClear}
      />

      <Paper
        elevation={3}
        sx={{
          mx: 1.5,
          my: 0.5,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
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
          onChange={(_e, newVal) => actions.setCurrentTab(newVal)}
          variant="fullWidth"
          sx={{
            px: 0.35,
            pt: 0.35,
            minHeight: "unset",
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTab-root": {
              minHeight: 8,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              color: "#45658f",
              fontWeight: 800,
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
            position: "relative",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            mx: 0.5,
            mb: 0.5,
          }}
        >
          <MainTabPanel active={currentTab === 0}>
            <ClientPage
              searchFirstName={searchFirstName}
              searchLastName={searchLastName}
              searchRequestKey={searchRequestKey}
              forcedClient={forcedClient}
              activeClient={selectedClient}
              onClientSelected={actions.setSelectedClient}
            />
          </MainTabPanel>

          <MainTabPanel active={currentTab === 1}>
            <TransactionPage
              clientNumber={selectedClient?.client_number}
              clientLastName={selectedClient?.last_name}
              clientFirstName={selectedClient?.first_name}
              clientMiddleName={selectedClient?.middle_name}
              focusTicketNumber={focusTicketNumber}
              focusRequestId={focusRequestId}
              incomingTicket={incomingTransactionTicket}
              incomingItemLoadRequest={incomingItemLoadRequest}
              onSelectedTicketChange={actions.setSelectedTransactionTicket}
            />
          </MainTabPanel>

          <MainTabPanel active={currentTab === 2}>
            <HistoryPage
              clientNumber={selectedClient?.client_number}
              clientLastName={selectedClient?.last_name}
              clientFirstName={selectedClient?.first_name}
              clientMiddleName={selectedClient?.middle_name}
              transactionTargetTicket={selectedTransactionTicket}
              onRepawnCreated={actions.handleRepawnCreated}
              onLoadItemsToTransaction={actions.handleLoadHistoryItems}
            />
          </MainTabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default MainLayout;
