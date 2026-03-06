import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import ClientProfile from "../components/client/profile/ClientProfile";
import ClientSearchResults from "../components/client/searchResults/ClientSearchResults";
import { useClientSearch } from "../hooks/useClientSearch";
import defaultClient from "../utils/defaultClient";
import type { Client } from "../../../shared/types/Client";

interface ClientPageProps {
  searchFirstName: string;
  searchLastName: string;
  forcedClient?: Client | null;
  activeClient?: Client | null;
  onClientSelected?: (client: Client | null) => void;
}
const ClientPage: React.FC<ClientPageProps> = ({
  searchFirstName,
  searchLastName,
  forcedClient,
  activeClient,
  onClientSelected,
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    forcedClient ?? activeClient ?? null,
  );

  const { results, loading, hasCompletedSearch } = useClientSearch(
    searchFirstName,
    searchLastName,
  );
  const [displayResults, setDisplayResults] = useState<Client[]>([]);
  const [clientOverrides, setClientOverrides] = useState<Record<number, Client>>(
    {},
  );
  const lastNoResultPromptKeyRef = useRef<string>("");

  useEffect(() => {
    if (forcedClient) {
      setSelectedClient(forcedClient);
      return;
    }

    if (activeClient) {
      setSelectedClient((prev) => prev ?? activeClient);
    }
  }, [forcedClient, activeClient]);

  useEffect(() => {
    const normalizedFirst = searchFirstName.trim().toLowerCase();
    const normalizedLast = searchLastName.trim().toLowerCase();
    const queryKey = `${normalizedFirst}|${normalizedLast}`;
    const hasQuery = Boolean(normalizedFirst || normalizedLast);
    const forcedClientNumber = forcedClient?.client_number;
    const mergedResults = results.map((client) => {
      const clientNumber = client.client_number;
      if (!clientNumber) {
        return client;
      }
      return clientOverrides[clientNumber] ?? client;
    });

    if (forcedClientNumber) {
      const mergedWithForced = mergedResults.some(
        (client) => client.client_number === forcedClientNumber,
      )
        ? mergedResults
        : [
            clientOverrides[forcedClientNumber] ?? forcedClient,
            ...mergedResults,
          ];
      setDisplayResults(mergedWithForced);
      setSelectedClient(
        mergedWithForced.find(
          (client) => client.client_number === forcedClientNumber,
        ) ?? (clientOverrides[forcedClientNumber] ?? forcedClient),
      );
      lastNoResultPromptKeyRef.current = "";
      return;
    }

    setDisplayResults(mergedResults);

    if (!hasQuery) {
      setSelectedClient(null);
      return;
    }

    if (loading || !hasCompletedSearch) {
      return;
    }

    if (mergedResults.length === 0) {
      setSelectedClient(null);
      if (lastNoResultPromptKeyRef.current !== queryKey) {
        alert("No client found.");
        lastNoResultPromptKeyRef.current = queryKey;
      }
      return;
    }

    lastNoResultPromptKeyRef.current = "";
    const preferredClientNumber =
      forcedClient?.client_number ?? activeClient?.client_number;
    const matchedClient = preferredClientNumber
      ? (mergedResults.find(
          (client) => client.client_number === preferredClientNumber,
        ) ?? null)
      : null;
    setSelectedClient((prev) => {
      if (prev?.client_number) {
        const mergedSelected = mergedResults.find(
          (client) => client.client_number === prev.client_number,
        );
        if (mergedSelected) {
          return mergedSelected;
        }
      }
      return matchedClient ?? mergedResults[0];
    });
  }, [
    results,
    clientOverrides,
    searchFirstName,
    searchLastName,
    loading,
    hasCompletedSearch,
    forcedClient,
    activeClient,
  ]);

  const handleClientUpdated = (updatedClient: Client) => {
    if (updatedClient.client_number) {
      setClientOverrides((prev) => ({
        ...prev,
        [updatedClient.client_number as number]: updatedClient,
      }));
    }
    setDisplayResults((prev) => {
      const exists = prev.some(
        (client) => client.client_number === updatedClient.client_number,
      );
      if (!exists) {
        return [updatedClient, ...prev];
      }

      return prev.map((client) =>
        client.client_number === updatedClient.client_number
          ? updatedClient
          : client,
      );
    });
    setSelectedClient(updatedClient);
  };

  useEffect(() => {
    onClientSelected?.(selectedClient);
  }, [selectedClient, onClientSelected]);

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        maxWidth: 1600,
        mx: "auto",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: 0.75,
          p: 1,
          pb: 1.25,
          minHeight: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pr: 0.25 }}>
          <ClientProfile
            client={selectedClient ?? defaultClient}
            showImage={false}
            onClientUpdated={handleClientUpdated}
            placeholder={!selectedClient}
          />
        </Box>

        <Box
          sx={{
            flex: "0 0 216px",
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            p: 1,
            backgroundColor: "background.paper",
            boxShadow:
              "0 0 0 1px rgba(25, 118, 210, 0.14), 0 10px 22px rgba(15, 23, 42, 0.10)",
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
          }}
        >
          {loading && (
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Searching...
            </Typography>
          )}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ClientSearchResults
              results={displayResults}
              selectedClient={selectedClient}
              onSelect={setSelectedClient}
              onClientUpdated={handleClientUpdated}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ClientPage;
