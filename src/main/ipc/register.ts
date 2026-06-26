import { registerClientHandlers } from "../modules/clients/index.ts";
import { registerEmployeeHandlers } from "../modules/employees/index.ts";
import { registerItemHandlers } from "../modules/items/index.ts";
import { registerReportHandlers } from "../modules/reports/index.ts";
import { registerTicketHandlers } from "../modules/tickets/index.ts";
import { registerWindowHandlers } from "./window.handlers.ts";

export const registerHandlers = () => {
  registerClientHandlers();
  registerEmployeeHandlers();
  registerTicketHandlers();
  registerReportHandlers();
  registerItemHandlers();
  registerWindowHandlers();
};
