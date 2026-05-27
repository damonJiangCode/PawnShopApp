import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const LayawayAddWindow: React.FC<MenuActionComponentProps> = ({ actionId }) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Add Layaway"
    description="Create a new layaway record."
  />
);

export default LayawayAddWindow;
