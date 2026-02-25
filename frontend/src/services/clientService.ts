import type { Client } from "../../../shared/types/Client";
import { searchClients as searchClientsApi } from "../api/clientApi";

const getElectronApi = () => (window as any).electronAPI;

export const searchClients = async (
  firstName: string,
  lastName: string
): Promise<Client[]> => {
  const safeFirst = firstName?.trim() ?? "";
  const safeLast = lastName?.trim() ?? "";

  if (!safeFirst && !safeLast) return [];
  if (!getElectronApi()?.searchClients) return [];

  try {
    return await searchClientsApi(safeFirst, safeLast);
  } catch {
    return [];
  }
};
