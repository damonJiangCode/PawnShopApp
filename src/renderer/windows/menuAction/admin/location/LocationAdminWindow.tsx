import React from "react";
import MenuActionLayout from "../../MenuActionLayout";
import type { MenuActionComponentProps } from "../../menuActionRegistry";

const LocationAdminWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout title="Location" description="Manage pawn locations." />
);

export default LocationAdminWindow;
