import type { ClientApi } from "./clientApi.ts";
import type { EmployeeApi } from "./employeeApi.ts";
import type { ItemApi } from "./itemApi.ts";
import type { TicketApi } from "./ticketApi.ts";
import type { WindowApi } from "./windowApi.ts";

export type AppApi = {
  client: ClientApi;
  employee: EmployeeApi;
  ticket: TicketApi;
  item: ItemApi;
  window: WindowApi;
};
