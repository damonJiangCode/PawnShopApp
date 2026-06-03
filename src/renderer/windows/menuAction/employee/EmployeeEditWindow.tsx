import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const EmployeeEditWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Edit Employee"
    description="Update employee information."
  />
);

export default EmployeeEditWindow;
