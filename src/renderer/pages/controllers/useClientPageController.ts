import { useEffect, useRef, useState } from "react";
import type { ClientNotesAction } from "../../../shared/types/clientApiTypes";
import type { Client, ID } from "../../../shared/types/Client";
import { useClientSearch } from "../../hooks/useClientSearch";
import { clientService } from "../../services/clientService";
import { formatIsoDate } from "../../utils/formatters";

interface UseClientPageControllerParams {
  searchFirstName: string;
  searchLastName: string;
  searchDateOfBirth?: string;
  searchRequestKey?: number;
  forcedClient?: Client | null;
  activeClient?: Client | null;
  onClientSelected?: (client: Client | null) => void;
}

const matchesSearch = (
  client: Client,
  normalizedFirst: string,
  normalizedLast: string,
  normalizedDob: string,
) => {
  const clientFirst = client.first_name?.trim().toLowerCase() ?? "";
  const clientLast = client.last_name?.trim().toLowerCase() ?? "";
  const clientDob = formatIsoDate(client.date_of_birth);

  const firstMatches =
    !normalizedFirst || clientFirst.startsWith(normalizedFirst);
  const lastMatches = !normalizedLast || clientLast.startsWith(normalizedLast);
  const dobMatches = !normalizedDob || clientDob === normalizedDob;

  return firstMatches && lastMatches && dobMatches;
};

export const useClientPageController = ({
  searchFirstName,
  searchLastName,
  searchDateOfBirth = "",
  searchRequestKey = 0,
  forcedClient,
  activeClient,
  onClientSelected,
}: UseClientPageControllerParams) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    forcedClient ?? activeClient ?? null,
  );
  const { results, loading, hasCompletedSearch, completedQueryKey } =
    useClientSearch(
      searchFirstName,
      searchLastName,
      searchDateOfBirth,
      searchRequestKey,
    );
  const [displayResults, setDisplayResults] = useState<Client[]>([]);
  const [clientOverrides, setClientOverrides] = useState<
    Record<number, Client>
  >({});
  const [deletedClientNumbers, setDeletedClientNumbers] = useState<number[]>(
    [],
  );
  const [createdClient, setCreatedClient] = useState<Client | null>(null);
  const lastNoResultPromptKeyRef = useRef<string>("");

  useEffect(() => {
    if (forcedClient) {
      setSelectedClient(forcedClient);
      return;
    }

    if (activeClient) {
      setSelectedClient((prev) =>
        !prev || prev.client_number === activeClient.client_number
          ? activeClient
          : prev,
      );
    }
  }, [forcedClient, activeClient]);

  useEffect(() => {
    setCreatedClient(null);
  }, [
    searchFirstName,
    searchLastName,
    searchDateOfBirth,
    searchRequestKey,
    forcedClient,
  ]);

  useEffect(() => {
    const normalizedFirst = searchFirstName.trim().toLowerCase();
    const normalizedLast = searchLastName.trim().toLowerCase();
    const normalizedDob = searchDateOfBirth.trim();
    const queryKey = `${normalizedFirst}|${normalizedLast}|${normalizedDob}`;
    const hasQuery = Boolean(normalizedFirst || normalizedLast || normalizedDob);
    const forcedClientNumber = forcedClient?.client_number;

    if (createdClient?.client_number) {
      setDisplayResults([createdClient]);
      setSelectedClient(createdClient);
      lastNoResultPromptKeyRef.current = "";
      return;
    }

    const getClientOverride = (clientNumber?: number) => {
      if (!clientNumber) {
        return null;
      }

      if (forcedClient?.client_number === clientNumber) {
        return forcedClient;
      }

      if (activeClient?.client_number === clientNumber) {
        return activeClient;
      }

      return clientOverrides[clientNumber] ?? null;
    };

    const mergedResults = results
      .map((client) => {
        const clientNumber = client.client_number;
        if (!clientNumber) {
          return client;
        }
        return getClientOverride(clientNumber) ?? client;
      })
      .filter(
        (client) =>
          !client.client_number ||
          !deletedClientNumbers.includes(client.client_number),
      );
    const mergedClientNumbers = new Set(
      mergedResults
        .map((client) => client.client_number)
        .filter((clientNumber): clientNumber is number =>
          Boolean(clientNumber),
        ),
    );
    const overrideResults = hasQuery
      ? [
          ...Object.values(clientOverrides),
          ...[forcedClient, activeClient].filter((client): client is Client =>
            Boolean(client?.client_number),
          ),
        ].filter((client, index, clients) => {
          const clientNumber = client.client_number;
          if (!clientNumber || deletedClientNumbers.includes(clientNumber)) {
            return false;
          }

          if (
            mergedClientNumbers.has(clientNumber) ||
            clients.findIndex(
              (current) => current.client_number === clientNumber,
            ) !== index
          ) {
            return false;
          }

          return matchesSearch(
            client,
            normalizedFirst,
            normalizedLast,
            normalizedDob,
          );
        })
      : [];
    const combinedResults = [...overrideResults, ...mergedResults];

    if (forcedClientNumber) {
      const mergedWithForced = combinedResults.some(
        (client) => client.client_number === forcedClientNumber,
      )
        ? combinedResults
        : [
            getClientOverride(forcedClientNumber) ?? forcedClient,
            ...combinedResults,
          ];
      setDisplayResults(mergedWithForced);
      setSelectedClient(
        mergedWithForced.find(
          (client) => client.client_number === forcedClientNumber,
        ) ??
          clientOverrides[forcedClientNumber] ??
          forcedClient,
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
    searchDateOfBirth,
    loading,
    hasCompletedSearch,
    completedQueryKey,
    forcedClient,
    activeClient,
  ]);

  useEffect(() => {
    onClientSelected?.(selectedClient);
  }, [selectedClient, onClientSelected]);

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
        prev.filter(
          (clientNumber) => clientNumber !== updatedClient.client_number,
        ),
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

  const handleSaveClientNotes = async ({
    client,
    identifications,
    notes,
    employeePassword,
    notesAction,
  }: {
    client: Client;
    identifications: ID[];
    notes: string;
    employeePassword: string;
    notesAction: ClientNotesAction;
  }) => {
    const updatedClient = await clientService.updateClient({
      client: {
        ...client,
        notes,
      },
      identifications: identifications || [],
      notes_action: notesAction,
      employee_password: employeePassword,
    });

    handleClientUpdated(updatedClient);
    return updatedClient;
  };

  return {
    state: {
      selectedClient,
      displayResults,
      loading,
    },
    actions: {
      setSelectedClient,
      handleClientCreated,
      handleClientUpdated,
      handleSaveClientNotes,
    },
  };
};
