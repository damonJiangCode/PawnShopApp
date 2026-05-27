import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const HolidayAddWindow: React.FC<MenuActionComponentProps> = ({ actionId }) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Add Holiday"
    description="Add a holiday for business-day hold calculations."
  />
);

export default HolidayAddWindow;
