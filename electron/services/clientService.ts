import type { Client } from "../../shared/types/Client.ts";
import {
  addClient,
  searchClientsByName,
  updateClient as updateClientInRepo,
} from "../db/repositories/clientRepository.ts";
import type { ID } from "../../shared/types/Client.ts";

export const searchClients = async (
  firstName: string,
  lastName: string
): Promise<Client[]> => {
  const safeFirst = firstName?.trim() ?? "";
  const safeLast = lastName?.trim() ?? "";

  if (!safeFirst && !safeLast) {
    return [];
  }

  return searchClientsByName(safeFirst, safeLast);
};

export const createClient = async (
  clientData: Client,
  ids: ID[]
): Promise<Client> => {
  return addClient(clientData, ids ?? []);
};

export const updateClient = async (
  clientData: Client,
  ids: ID[]
): Promise<Client> => {
  return updateClientInRepo(clientData, ids ?? []);
};
