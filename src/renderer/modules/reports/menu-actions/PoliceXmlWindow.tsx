import React from "react";
import MenuWindowLayout from "../../../shared/layout/MenuWindowLayout";
import type { WindowHostScreenProps } from "../../../app/window-host/windowHostRegistry";

const PoliceXmlWindow: React.FC<WindowHostScreenProps> = () => (
  <MenuWindowLayout
    title="Police XML / BWI"
    description="Generate the daily police XML file."
  />
);

export default PoliceXmlWindow;
