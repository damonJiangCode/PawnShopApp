import React from "react";
import MenuActionLayout from "../../MenuActionLayout";
import type { MenuActionComponentProps } from "../../menuActionRegistry";

const HolidayAdminWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Holiday"
    description="Manage business-day holidays."
  />
);

export default HolidayAdminWindow;
