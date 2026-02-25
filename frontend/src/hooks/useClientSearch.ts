import { useEffect, useState } from "react";
import type { Client } from "../../../shared/types/Client";
import { searchClients } from "../services/clientService";

export const useClientSearch = (firstName: string, lastName: string) => {
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);

  useEffect(() => {
    const hasQuery = Boolean(firstName.trim() || lastName.trim());

    if (!hasQuery) {
      setResults([]);
      setLoading(false);
      setHasCompletedSearch(false);
      return;
    }

    let active = true;

    const run = async () => {
      setHasCompletedSearch(false);
      setLoading(true);
      try {
        const data = await searchClients(firstName, lastName);
        if (!active) return;
        setResults(data);
      } finally {
        if (!active) return;
        setLoading(false);
        setHasCompletedSearch(true);
      }
    };
    run();

    return () => {
      active = false;
    };
  }, [firstName, lastName]);

  return { results, loading, hasCompletedSearch };
};
