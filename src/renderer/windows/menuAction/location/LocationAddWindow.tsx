import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const LocationAddWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Add Location"
    description="Add a new pawn location."
  />
);

export default LocationAddWindow;
