import type { ElectronClientApi } from "./clientApi.ts";
import type { ElectronItemApi } from "./itemApi.ts";
import type {
  ElectronTicketApi,
} from "./ticketApi.ts";
import type { ElectronWindowApi } from "./windowApi.ts";

export type ElectronApi = {
  client: ElectronClientApi;
  ticket: ElectronTicketApi;
  item: ElectronItemApi;
  window: ElectronWindowApi;
};
