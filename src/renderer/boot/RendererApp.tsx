import React from "react";
import WorkspaceApp from "../workspace/WorkspaceApp";
import WindowView from "../windows/WindowView";

const WINDOW_QUERY_PARAM = "window";

const isWindowView = (search = window.location.search): boolean => {
  return new URLSearchParams(search).has(WINDOW_QUERY_PARAM);
};

const RendererApp: React.FC = () => {
  return isWindowView() ? <WindowView /> : <WorkspaceApp />;
};

export default RendererApp;
