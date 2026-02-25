import { useEffect, useState } from "react";
import type { Ticket } from "../../../shared/types/Ticket";
import { loadTickets } from "../services/transactionService";

export const useTickets = (clientNumber?: number) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const result = await loadTickets(clientNumber);
      setTickets(result);
      setLoading(false);
    };
    fetchTickets();
  }, [clientNumber]);

  return { tickets, loading, setTickets };
};
