import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const LayawayEditWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Edit Layaway"
    description="Update layaway item or payment information."
  />
);

export default LayawayEditWindow;
