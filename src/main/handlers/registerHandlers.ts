import { registerClientHandlers } from "./clientHandlers.ts";
import { registerItemHandlers } from "./itemHandlers.ts";
import { registerTicketHandlers } from "./ticketHandlers.ts";

export const registerHandlers = () => {
  registerClientHandlers();
  registerTicketHandlers();
  registerItemHandlers();
};
