import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const HolidayAddWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Add Holiday"
    description="Add a holiday for business-day hold calculations."
  />
);

export default HolidayAddWindow;
