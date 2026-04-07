import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import ClientPanel from "../components/client/profile/ClientPanel";
import ClientsPanel from "../components/client/clientresults/ClientsPanel";
import { useClientSearch } from "../hooks/useClientSearch";
import defaultClient from "../utils/defaultClient";
import type { Client } from "../../shared/types/Client";

interface ClientPageProps {
  searchFirstName: string;
  searchLastName: string;
  searchRequestKey?: number;
  forcedClient?: Client | null;
  activeClient?: Client | null;
  onClientSelected?: (client: Client | null) => void;
}

const ClientPage: React.FC<ClientPageProps> = ({
  searchFirstName,
  searchLastName,
  searchRequestKey = 0,
  forcedClient,
  activeClient,
  onClientSelected,
}) => {
  const matchesSearch = (
    client: Client,
    normalizedFirst: string,
    normalizedLast: string,
  ) => {
    const clientFirst = client.first_name?.trim().toLowerCase() ?? "";
    const clientLast = client.last_name?.trim().toLowerCase() ?? "";

    const firstMatches =
      !normalizedFirst || clientFirst.startsWith(normalizedFirst);
    const lastMatches =
      !normalizedLast || clientLast.startsWith(normalizedLast);

    return firstMatches && lastMatches;
  };

  const [selectedClient, setSelectedClient] = useState<Client | null>(
    forcedClient ?? activeClient ?? null,
  );

  const { results, loading, hasCompletedSearch, completedQueryKey } = useClientSearch(
    searchFirstName,
    searchLastName,
    searchRequestKey,
  );
  const [displayResults, setDisplayResults] = useState<Client[]>([]);
  const [clientOverrides, setClientOverrides] = useState<Record<number, Client>>(
    {},
  );
  const [deletedClientNumbers, setDeletedClientNumbers] = useState<number[]>([]);
  const [createdClient, setCreatedClient] = useState<Client | null>(null);
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
    setCreatedClient(null);
  }, [searchFirstName, searchLastName, searchRequestKey, forcedClient]);

  useEffect(() => {
    const normalizedFirst = searchFirstName.trim().toLowerCase();
    const normalizedLast = searchLastName.trim().toLowerCase();
    const queryKey = `${normalizedFirst}|${normalizedLast}`;
    const hasQuery = Boolean(normalizedFirst || normalizedLast);
    const forcedClientNumber = forcedClient?.client_number;

    if (createdClient?.client_number) {
      setDisplayResults([createdClient]);
      setSelectedClient(createdClient);
      lastNoResultPromptKeyRef.current = "";
      return;
    }

    const mergedResults = results
      .map((client) => {
        const clientNumber = client.client_number;
        if (!clientNumber) {
          return client;
        }
        return clientOverrides[clientNumber] ?? client;
      })
      .filter(
        (client) =>
          !client.client_number ||
          !deletedClientNumbers.includes(client.client_number),
      );
    const mergedClientNumbers = new Set(
      mergedResults
        .map((client) => client.client_number)
        .filter((clientNumber): clientNumber is number => Boolean(clientNumber)),
    );
    const overrideResults = hasQuery
      ? Object.values(clientOverrides).filter((client) => {
          const clientNumber = client.client_number;
          if (!clientNumber || deletedClientNumbers.includes(clientNumber)) {
            return false;
          }

          if (mergedClientNumbers.has(clientNumber)) {
            return false;
          }

          return matchesSearch(client, normalizedFirst, normalizedLast);
        })
      : [];
    const combinedResults = [...overrideResults, ...mergedResults];

    if (forcedClientNumber) {
      const mergedWithForced = combinedResults.some(
        (client) => client.client_number === forcedClientNumber,
      )
        ? combinedResults
        : [
            clientOverrides[forcedClientNumber] ?? forcedClient,
            ...combinedResults,
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

    setDisplayResults(combinedResults);

    if (!hasQuery) {
      setSelectedClient(forcedClient ?? activeClient ?? null);
      return;
    }

    if (loading || !hasCompletedSearch || completedQueryKey !== queryKey) {
      return;
    }

    if (combinedResults.length === 0) {
      setSelectedClient(null);
      const searchReturnedNoClients = results.length === 0;
      if (
        searchReturnedNoClients &&
        lastNoResultPromptKeyRef.current !== queryKey
      ) {
        alert("No client found.");
        lastNoResultPromptKeyRef.current = queryKey;
        return;
      }
      lastNoResultPromptKeyRef.current = "";
      return;
    }

    lastNoResultPromptKeyRef.current = "";
    const preferredClientNumber =
      forcedClient?.client_number ?? activeClient?.client_number;
    const matchedClient = preferredClientNumber
      ? (combinedResults.find(
          (client) => client.client_number === preferredClientNumber,
        ) ?? null)
      : null;
    setSelectedClient((prev) => {
      if (prev?.client_number) {
        const mergedSelected = combinedResults.find(
          (client) => client.client_number === prev.client_number,
        );
        if (mergedSelected) {
          return mergedSelected;
        }
      }
      return matchedClient ?? combinedResults[0];
    });
  }, [
    createdClient,
    results,
    clientOverrides,
    deletedClientNumbers,
    searchFirstName,
    searchLastName,
    loading,
    hasCompletedSearch,
    completedQueryKey,
    forcedClient,
    activeClient,
  ]);

  const handleClientCreated = (newClient: Client) => {
    if (newClient.client_number) {
      setDeletedClientNumbers((prev) =>
        prev.filter((clientNumber) => clientNumber !== newClient.client_number),
      );
      setClientOverrides((prev) => ({
        ...prev,
        [newClient.client_number as number]: newClient,
      }));
    }
    setCreatedClient(newClient);
    setDisplayResults([newClient]);
    setSelectedClient(newClient);
  };

  const handleClientUpdated = (updatedClient: Client) => {
    if (updatedClient.client_number) {
      setDeletedClientNumbers((prev) =>
        prev.filter((clientNumber) => clientNumber !== updatedClient.client_number),
      );
      setClientOverrides((prev) => ({
        ...prev,
        [updatedClient.client_number as number]: updatedClient,
      }));
    }

    if (createdClient?.client_number === updatedClient.client_number) {
      setCreatedClient(updatedClient);
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
          <ClientPanel
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
            <ClientsPanel
              results={displayResults}
              selectedClient={selectedClient}
              onSelect={setSelectedClient}
              onClientCreated={handleClientCreated}
              onClientUpdated={handleClientUpdated}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ClientPage;
