import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const PoliceXmlWindow: React.FC<MenuActionComponentProps> = ({ actionId }) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Police XML / BWI"
    description="Generate the daily police XML file."
  />
);

export default PoliceXmlWindow;
