import React from "react";
import WindowLayout from "../../../windows/WindowLayout";
import type { WindowScreenProps } from "../../../windows/windowRegistry";

const PoliceXmlWindow: React.FC<WindowScreenProps> = () => (
  <WindowLayout
    title="Police XML / BWI"
    description="Generate the daily police XML file."
  />
);

export default PoliceXmlWindow;
