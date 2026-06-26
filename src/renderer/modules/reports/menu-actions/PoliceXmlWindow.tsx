import React from "react";
import MenuActionLayout from "../../../shared/menu-action/MenuActionLayout";
import type { MenuActionComponentProps } from "../../../app/menu-action/menuActionRegistry";

const PoliceXmlWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Police XML / BWI"
    description="Generate the daily police XML file."
  />
);

export default PoliceXmlWindow;
