import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const EmployeeDeactivateWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Deactivate Employee"
    description="Disable an employee without removing history."
  />
);

export default EmployeeDeactivateWindow;
