import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const InterestReportWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Interest Report"
    description="Generate interest payment records."
  />
);

export default InterestReportWindow;
