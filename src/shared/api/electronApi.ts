import type { ElectronClientApi } from "./clientApi.ts";
import type { ElectronEmployeeApi } from "./employeeApi.ts";
import type { ElectronItemApi } from "./itemApi.ts";
import type { ElectronTicketApi } from "./ticketApi.ts";
import type { ElectronWindowApi } from "./windowApi.ts";

export type ElectronApi = {
  client: ElectronClientApi;
  employee: ElectronEmployeeApi;
  ticket: ElectronTicketApi;
  item: ElectronItemApi;
  window: ElectronWindowApi;
};
