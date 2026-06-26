import type { ComponentType } from "react";
import MainApp from "./main/MainApp";
import ItemLoadWindowApp from "../modules/items/item-load/ItemLoadWindowApp";
import MenuActionWindowApp from "./menu-action/MenuActionWindowApp";
import PaymentWindowApp from "../modules/tickets/payment/PaymentWindowApp";

const WINDOW_QUERY_PARAM = "window";

const windowApps: Record<string, ComponentType> = {
  "item-load": ItemLoadWindowApp,
  "menu-action": MenuActionWindowApp,
  payment: PaymentWindowApp,
};

export const resolveRendererApp = (
  search = window.location.search,
): ComponentType => {
  const windowKey = new URLSearchParams(search).get(WINDOW_QUERY_PARAM);

  if (!windowKey) {
    return MainApp;
  }

  return windowApps[windowKey] ?? MainApp;
};
