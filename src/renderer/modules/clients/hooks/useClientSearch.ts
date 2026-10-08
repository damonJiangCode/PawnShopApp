import {
  normalizeClientLookup,
  type ClientLookup,
} from "../../../../shared/utils/clientLookup";
import { useEffect, useRef, useState } from "react";
import type { Client } from "../../../../shared/models/client.model";
import { clientApi } from "../client.api";

export const useClientSearch = (
  firstName: string,
  lastName: string,
  dateOfBirth = "",
  searchRequestKey = 0,
  isActive = true,
  lookup?: ClientLookup,
) => {
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);
  const [completedQueryKey, setCompletedQueryKey] = useState("");
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      latestRequestIdRef.current += 1;
      setLoading(false);
      return;
    }

    const normalizedFirst = firstName.trim().toLowerCase();
    const normalizedLast = lastName.trim().toLowerCase();
    const normalizedDob = dateOfBirth.trim();
    const normalizedLookup = lookup ? normalizeClientLookup(lookup) : undefined;
    const queryKey = JSON.stringify([
      normalizedFirst,
      normalizedLast,
      normalizedDob,
      normalizedLookup,
    ]);
    const hasQuery = Boolean(
      normalizedFirst ||
      normalizedLast ||
      normalizedDob ||
      normalizedLookup?.value,
    );

    if (!hasQuery) {
      latestRequestIdRef.current += 1;
      setResults([]);
      setLoading(false);
      setError("");
      setHasCompletedSearch(false);
      setCompletedQueryKey("");
      return;
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    const run = async () => {
      setResults([]);
      setError("");
      setHasCompletedSearch(false);
      setLoading(true);
      try {
        const data = normalizedLookup?.value
          ? await clientApi.searchClientsByLookup(normalizedLookup)
          : normalizedDob
            ? await clientApi.searchClientsByDob(normalizedDob)
            : await clientApi.searchClients(normalizedFirst, normalizedLast);
        if (latestRequestIdRef.current !== requestId) return;
        setResults(data);
        setCompletedQueryKey(queryKey);
      } catch (err) {
        if (latestRequestIdRef.current !== requestId) return;
        console.error("Failed to search clients", err);
        setError(
          err instanceof Error ? err.message : "Unable to search clients.",
        );
      } finally {
        if (latestRequestIdRef.current !== requestId) return;
        setLoading(false);
        setHasCompletedSearch(true);
      }
    };
    void run();
    return () => {
      latestRequestIdRef.current += 1;
    };
  }, [firstName, lastName, dateOfBirth, searchRequestKey, isActive, lookup]);

  return { results, loading, error, hasCompletedSearch, completedQueryKey };
};
