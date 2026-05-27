import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const TicketSearchWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Search Ticket"
    description="Search tickets by ticket number."
  />
);

export default TicketSearchWindow;
