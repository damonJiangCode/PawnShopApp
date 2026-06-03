import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const LayawayCancelWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Cancel Layaway"
    description="Cancel an existing layaway record."
  />
);

export default LayawayCancelWindow;
