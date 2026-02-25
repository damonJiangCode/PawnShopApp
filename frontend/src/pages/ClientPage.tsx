import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import ClientProfile from "../components/client/profile/ClientProfile";
import ClientSearchResults from "../components/client/search/ClientSearchResults";
import { useClientSearch } from "../hooks/useClientSearch";
import type { Client } from "../../../shared/types/Client";

interface ClientPageProps {
  searchFirstName: string;
  searchLastName: string;
}
const ClientPage: React.FC<ClientPageProps> = ({
  searchFirstName,
  searchLastName,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { results, loading } = useClientSearch(searchFirstName, searchLastName);
  const [displayResults, setDisplayResults] = useState<Client[]>([]);
  const lastNoResultPromptKeyRef = useRef<string>("");

  useEffect(() => {
    const normalizedFirst = searchFirstName.trim().toLowerCase();
    const normalizedLast = searchLastName.trim().toLowerCase();
    const queryKey = `${normalizedFirst}|${normalizedLast}`;
    const hasQuery = Boolean(normalizedFirst || normalizedLast);

    setDisplayResults(results);

    if (!hasQuery) {
      return;
    }

    if (results.length === 0) {
      setSelectedClient(null);
      if (lastNoResultPromptKeyRef.current !== queryKey) {
        alert("No client found.");
        lastNoResultPromptKeyRef.current = queryKey;
      }
      return;
    }

    lastNoResultPromptKeyRef.current = "";
    setSelectedClient(results[0]);
  }, [results, searchFirstName, searchLastName]);

  const handleClientUpdated = (updatedClient: Client) => {
    setDisplayResults((prev) =>
      prev.map((client) =>
        client.client_number === updatedClient.client_number
          ? updatedClient
          : client
      )
    );
    setSelectedClient(updatedClient);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        maxWidth: 1600,
        mx: "auto",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: 1.5,
          p: 1.5,
          pb: 2,
          minHeight: 0,
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pr: 0.5 }}>
          {selectedClient ? (
            <ClientProfile client={selectedClient} showImage={false} />
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary">
                Select a client from search results.
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            p: 2,
            backgroundColor: "background.paper",
            boxShadow:
              "0 0 0 3px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
            minHeight: 220,
            overflow: "visible",
            mb: 0.5,
          }}
        >
          {loading && (
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Searching...
            </Typography>
          )}
          <ClientSearchResults
            results={displayResults}
            selectedClient={selectedClient}
            onSelect={setSelectedClient}
            onClientUpdated={handleClientUpdated}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ClientPage;
