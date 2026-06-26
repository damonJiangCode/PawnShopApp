import { useEffect, useRef, useState } from "react";
import type { Client } from "../../../../shared/types/Client";
import { clientService } from "../client.api";

export const useClientSearch = (
  firstName: string,
  lastName: string,
  dateOfBirth = "",
  searchRequestKey = 0,
) => {
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);
  const [completedQueryKey, setCompletedQueryKey] = useState("");
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    const normalizedFirst = firstName.trim().toLowerCase();
    const normalizedLast = lastName.trim().toLowerCase();
    const normalizedDob = dateOfBirth.trim();
    const queryKey = `${normalizedFirst}|${normalizedLast}|${normalizedDob}`;
    const hasQuery = Boolean(normalizedFirst || normalizedLast || normalizedDob);

    if (!hasQuery) {
      setResults([]);
      setLoading(false);
      setHasCompletedSearch(false);
      setCompletedQueryKey("");
      return;
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;

    const run = async () => {
      setResults([]);
      setHasCompletedSearch(false);
      setLoading(true);
      try {
        const data = normalizedDob
          ? await clientService.searchClientsByDob(normalizedDob)
          : await clientService.searchClients(normalizedFirst, normalizedLast);
        if (latestRequestIdRef.current !== requestId) return;
        setResults(data);
        setCompletedQueryKey(queryKey);
      } finally {
        if (latestRequestIdRef.current !== requestId) return;
        setLoading(false);
        setHasCompletedSearch(true);
      }
    };
    run();
  }, [firstName, lastName, dateOfBirth, searchRequestKey]);

  return { results, loading, hasCompletedSearch, completedQueryKey };
};
