import { registerClientHandlers } from "./clientHandlers.ts";
import { registerEmployeeHandlers } from "./employeeHandlers.ts";
import { registerItemHandlers } from "./itemHandlers.ts";
import { registerTicketHandlers } from "./ticketHandlers.ts";
import { registerWindowHandlers } from "./windowHandlers.ts";

export const registerHandlers = () => {
  registerClientHandlers();
  registerEmployeeHandlers();
  registerTicketHandlers();
  registerItemHandlers();
  registerWindowHandlers();
};
