import React from "react";
import MenuActionLayout from "../../../shared/menu-action/MenuActionLayout";
import type { WindowHostScreenProps } from "../../../app/window-host/windowHostRegistry";

const DailyReportWindow: React.FC<WindowHostScreenProps> = () => (
  <MenuActionLayout
    title="Daily Report"
    description="Generate daily ticket and payment records."
  />
);

export default DailyReportWindow;
