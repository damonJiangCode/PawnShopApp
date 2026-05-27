import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const LayawayCancelWindow: React.FC<MenuActionComponentProps> = ({
  actionId,
}) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Cancel Layaway"
    description="Cancel an existing layaway record."
  />
);

export default LayawayCancelWindow;
