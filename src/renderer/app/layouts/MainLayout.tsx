import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import TopBar from "../../components/appShell/TopBar";
import ClientPage from "../../pages/ClientPage";
import TransactionPage from "../../pages/TransactionPage";
import type { TransactionItemLoadRequest } from "../../pages/TransactionPage";
import HistoryPage from "../../pages/HistoryPage";
import type { Client } from "../../../shared/types/Client";
import type { Ticket } from "../../../shared/types/Ticket";
import type { Item } from "../../../shared/types/Item";

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchRequestKey, setSearchRequestKey] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [forcedClient, setForcedClient] = useState<Client | null>(null);
  const [selectedTransactionTicket, setSelectedTransactionTicket] =
    useState<Ticket | null>(null);
  const [incomingTransactionTicket, setIncomingTransactionTicket] =
    useState<Ticket | null>(null);
  const [incomingItemLoadRequest, setIncomingItemLoadRequest] =
    useState<TransactionItemLoadRequest | null>(null);
  const [focusTicketNumber, setFocusTicketNumber] = useState<number | undefined>();
  const [focusRequestId, setFocusRequestId] = useState(0);
  const [itemLoadRequestId, setItemLoadRequestId] = useState(0);

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
    setSearchRequestKey((prev) => prev + 1);
    setSelectedClient(null);
    setSelectedTransactionTicket(null);
    setIncomingTransactionTicket(null);
    setIncomingItemLoadRequest(null);
    setFocusTicketNumber(undefined);
  };

  const sendItemsToTransaction = (
    targetTicket: Ticket,
    sourceTicket: Ticket,
    sourceItems: Item[],
    mode: "repawn" | "load",
  ) => {
    if (!targetTicket.ticket_number || !sourceTicket.ticket_number) {
      return;
    }

    const nextRequestId = itemLoadRequestId + 1;
    setItemLoadRequestId(nextRequestId);
    setIncomingItemLoadRequest({
      requestId: nextRequestId,
      targetTicketNumber: targetTicket.ticket_number,
      sourceTicketNumber: sourceTicket.ticket_number,
      sourceTicketDescription: sourceTicket.description,
      items: sourceItems,
      mode,
    });
  };

  const handleRepawnCreated = (
    ticket: Ticket,
    sourceTicket: Ticket,
    sourceItems: Item[],
  ) => {
    setIncomingTransactionTicket(ticket);
    setFocusTicketNumber(ticket.ticket_number);
    setFocusRequestId((prev) => prev + 1);
    setCurrentTab(1);
    sendItemsToTransaction(ticket, sourceTicket, sourceItems, "repawn");
  };

  const handleLoadHistoryItems = (sourceTicket: Ticket, sourceItems: Item[]) => {
    if (!selectedTransactionTicket) {
      setCurrentTab(1);
      return;
    }

    setCurrentTab(1);
    sendItemsToTransaction(
      selectedTransactionTicket,
      sourceTicket,
      sourceItems,
      "load",
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar onSearch={handleSearch} onClear={handleClear} />

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
            onChange={(_e, newVal) => setCurrentTab(newVal)}
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
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                height: "100%",
                visibility: currentTab === 0 ? "visible" : "hidden",
                pointerEvents: currentTab === 0 ? "auto" : "none",
              }}
            >
              <ClientPage
                searchFirstName={searchFirstName}
                searchLastName={searchLastName}
                searchRequestKey={searchRequestKey}
                forcedClient={forcedClient}
                activeClient={selectedClient}
                onClientSelected={setSelectedClient}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                height: "100%",
                visibility: currentTab === 1 ? "visible" : "hidden",
                pointerEvents: currentTab === 1 ? "auto" : "none",
              }}
            >
              <TransactionPage
                clientNumber={selectedClient?.client_number}
                clientLastName={selectedClient?.last_name}
                clientFirstName={selectedClient?.first_name}
                clientMiddleName={selectedClient?.middle_name}
                focusTicketNumber={focusTicketNumber}
                focusRequestId={focusRequestId}
                incomingTicket={incomingTransactionTicket}
                incomingItemLoadRequest={incomingItemLoadRequest}
                onSelectedTicketChange={setSelectedTransactionTicket}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                height: "100%",
                visibility: currentTab === 2 ? "visible" : "hidden",
                pointerEvents: currentTab === 2 ? "auto" : "none",
              }}
            >
              <HistoryPage
                clientNumber={selectedClient?.client_number}
                clientLastName={selectedClient?.last_name}
                clientFirstName={selectedClient?.first_name}
                clientMiddleName={selectedClient?.middle_name}
                transactionTargetTicket={selectedTransactionTicket}
                onRepawnCreated={handleRepawnCreated}
                onLoadItemsToTransaction={handleLoadHistoryItems}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
  );
};

export default MainLayout;
