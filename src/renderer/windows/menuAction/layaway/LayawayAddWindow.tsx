import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const LayawayAddWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Add Layaway"
    description="Create a new layaway record."
  />
);

export default LayawayAddWindow;
