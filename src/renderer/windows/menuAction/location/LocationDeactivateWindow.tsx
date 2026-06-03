import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const LocationDeactivateWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Deactivate Location"
    description="Hide an old location from future tickets."
  />
);

export default LocationDeactivateWindow;
