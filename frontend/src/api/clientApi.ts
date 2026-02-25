import type { Client } from "../../../shared/types/Client";

export const searchClients = async (
  firstName: string,
  lastName: string
): Promise<Client[]> => {
  return (window as any).electronAPI.searchClients(firstName, lastName);
};
