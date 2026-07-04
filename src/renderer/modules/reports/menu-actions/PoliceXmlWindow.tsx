import React from "react";
import MenuActionLayout from "../../../shared/menu-action/MenuActionLayout";
import type { WindowHostScreenProps } from "../../../app/window-host/windowHostRegistry";

const PoliceXmlWindow: React.FC<WindowHostScreenProps> = () => (
  <MenuActionLayout
    title="Police XML / BWI"
    description="Generate the daily police XML file."
  />
);

export default PoliceXmlWindow;
