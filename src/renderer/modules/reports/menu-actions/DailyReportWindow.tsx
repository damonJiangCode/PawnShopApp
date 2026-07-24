import React from "react";
import WindowLayout from "../../../windows/WindowLayout";
import type { WindowScreenProps } from "../../../windows/windowRegistry";

const DailyReportWindow: React.FC<WindowScreenProps> = () => (
  <WindowLayout
    title="Daily Report"
    description="Generate daily ticket and payment records."
  />
);

export default DailyReportWindow;
