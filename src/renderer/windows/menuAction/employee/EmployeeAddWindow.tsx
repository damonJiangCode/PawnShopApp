import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";
import EmployeeAddEditDialog from "./EmployeeAddEditDialog";

const EmployeeAddWindow: React.FC<MenuActionComponentProps> = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <MenuActionLayout
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
    </MenuActionLayout>
  );
};

export default EmployeeAddWindow;
