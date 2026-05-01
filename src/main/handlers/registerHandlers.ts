import { registerClientHandlers } from "./clientHandlers.ts";
import { registerItemHandlers } from "./itemHandlers.ts";
import { registerTicketHandlers } from "./ticketHandlers.ts";
import { registerWindowHandlers } from "./windowHandlers.ts";

export const registerHandlers = () => {
  registerClientHandlers();
  registerTicketHandlers();
  registerItemHandlers();
  registerWindowHandlers();
};
