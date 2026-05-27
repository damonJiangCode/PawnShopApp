import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const BuybackReportWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Buyback Report"
    description="Generate daily pickup/buyback reconciliation."
  />
);

export default BuybackReportWindow;
