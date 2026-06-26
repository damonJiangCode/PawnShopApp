import React from "react";
import MenuActionLayout from "../../../shared/menu-action/MenuActionLayout";
import type { MenuActionComponentProps } from "../../../app/menu-action/menuActionRegistry";

const DailyReportWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Daily Report"
    description="Generate daily ticket and payment records."
  />
);

export default DailyReportWindow;
