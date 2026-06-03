import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const LayawaySearchWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Search Layaway"
    description="Search layaway records by customer name."
  />
);

export default LayawaySearchWindow;
