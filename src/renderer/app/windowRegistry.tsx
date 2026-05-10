import type { ComponentType } from "react";
import MainApp from "./main/MainApp";
import ItemLoadWindowApp from "./windows/itemLoad/ItemLoadWindowApp";
import PaymentWindowApp from "./windows/payment/PaymentWindowApp";

const WINDOW_QUERY_PARAM = "window";

const windowApps: Record<string, ComponentType> = {
  "item-load": ItemLoadWindowApp,
  "payment": PaymentWindowApp,
};

export const resolveRendererApp = (search = window.location.search): ComponentType => {
  const windowKey = new URLSearchParams(search).get(WINDOW_QUERY_PARAM);

  if (!windowKey) {
    return MainApp;
  }

  return windowApps[windowKey] ?? MainApp;
};
