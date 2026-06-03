import React from "react";
import MenuActionLayout from "../MenuActionLayout";
import type { MenuActionComponentProps } from "../menuActionRegistry";

const BuybackReportWindow: React.FC<MenuActionComponentProps> = () => (
  <MenuActionLayout
    title="Buyback Report"
    description="Generate daily pickup/buyback reconciliation."
  />
);

export default BuybackReportWindow;
