import { useEffect, useState } from "react";
import type { Client } from "../../../shared/types/Client";
import { searchClients } from "../services/clientService";

export const useClientSearch = (firstName: string, lastName: string) => {
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const data = await searchClients(firstName, lastName);
      setResults(data);
      setLoading(false);
    };
    run();
  }, [firstName, lastName]);

  return { results, loading };
};
