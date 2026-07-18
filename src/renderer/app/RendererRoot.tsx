import React from "react";
import type { ComponentType } from "react";
import MainApp from "./main/MainApp";
import WindowHostApp from "./window-host/WindowHostApp";

const WINDOW_QUERY_PARAM = "window";

const windowApps: Record<string, ComponentType> = {
  host: WindowHostApp,
};

const resolveRendererApp = (search = window.location.search): ComponentType => {
  const windowKey = new URLSearchParams(search).get(WINDOW_QUERY_PARAM);

  if (!windowKey) {
    return MainApp;
  }

  return windowApps[windowKey] ?? MainApp;
};

const RendererRoot: React.FC = () => {
  const RootApp = resolveRendererApp();

  return <RootApp />;
};

export default RendererRoot;
