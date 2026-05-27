import React from "react";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";

const ItemSearchWindow: React.FC<MenuActionComponentProps> = ({ actionId }) => (
  <MenuActionPlaceholder
    actionId={actionId}
    title="Search Item"
    description="Search by item number, brand name, model number, or serial number."
  />
);

export default ItemSearchWindow;
