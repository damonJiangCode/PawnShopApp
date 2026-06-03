import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const HolidayRemoveWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Remove Holiday"
    description="Remove a holiday from business-day calculations."
  />
);

export default HolidayRemoveWindow;
