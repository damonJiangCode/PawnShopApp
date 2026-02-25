import { useEffect, useState } from "react";
import type { Item } from "../../../shared/types/Item";
import { loadItems } from "../services/transactionService";

export const useItems = (ticketNumber?: number) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const result = await loadItems(ticketNumber);
      setItems(result);
      setLoading(false);
    };
    fetchItems();
  }, [ticketNumber]);

  return { items, loading, setItems };
};
