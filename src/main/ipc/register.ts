import { registerClientHandlers } from "../modules/clients/client.handlers.ts";
import { registerEmployeeHandlers } from "../modules/employees/employee.handlers.ts";
import { registerItemHandlers } from "../modules/items/item.handlers.ts";
import { registerReportHandlers } from "../modules/reports/report.handlers.ts";
import { registerTicketHandlers } from "../modules/tickets/ticket.handlers.ts";
import { registerWindowHandlers } from "./window.handlers.ts";

export const registerHandlers = () => {
  registerClientHandlers();
  registerEmployeeHandlers();
  registerTicketHandlers();
  registerReportHandlers();
  registerItemHandlers();
  registerWindowHandlers();
};
