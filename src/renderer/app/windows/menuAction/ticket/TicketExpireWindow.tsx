import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const TicketExpireWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Expire Ticket"
    description="Enter a ticket number and expire it."
  />
);

export default TicketExpireWindow;
