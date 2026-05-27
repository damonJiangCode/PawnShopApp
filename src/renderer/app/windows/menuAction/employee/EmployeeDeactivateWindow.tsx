import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const EmployeeDeactivateWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Deactivate Employee"
    description="Disable an employee without removing history."
  />
);

export default EmployeeDeactivateWindow;
