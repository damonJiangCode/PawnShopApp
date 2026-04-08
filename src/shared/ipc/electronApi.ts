import type { ElectronClientApi } from "./clientApi.ts";
import type { ElectronItemApi } from "./itemApi.ts";
import type {
  ElectronTicketApi,
} from "./ticketApi.ts";

export type ElectronApi = {
  client: ElectronClientApi;
  ticket: ElectronTicketApi;
  item: ElectronItemApi;
};
