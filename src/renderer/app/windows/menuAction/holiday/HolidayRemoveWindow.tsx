import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const HolidayRemoveWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Remove Holiday"
    description="Remove a holiday from business-day calculations."
  />
);

export default HolidayRemoveWindow;
