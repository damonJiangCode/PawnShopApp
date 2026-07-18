import React from "react";
import MenuWindowLayout from "../../../shared/layout/MenuWindowLayout";
import type { WindowHostScreenProps } from "../../../app/window-host/windowHostRegistry";

const DailyReportWindow: React.FC<WindowHostScreenProps> = () => (
  <MenuWindowLayout
    title="Daily Report"
    description="Generate daily ticket and payment records."
  />
);

export default DailyReportWindow;
