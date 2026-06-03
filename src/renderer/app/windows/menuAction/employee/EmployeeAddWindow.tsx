import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";
import EmployeeAddEditDialog from "./EmployeeAddEditDialog";

const EmployeeAddWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <MenuActionPlaceholder
      actionId={actionId}
      title="Add Employee"
      description="Create a new employee account."
    >
      <EmployeeAddEditDialog
        open={open}
        onClose={() => {
          setOpen(false);
          window.close();
        }}
      />
    </MenuActionPlaceholder>
  );
};

export default EmployeeAddWindow;
