import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const TicketStolenWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Mark Ticket Stolen"
    description="Mark a ticket as stolen for police/risk tracking."
  />
);

export default TicketStolenWindow;
