import React from "react";
import { resolveRendererApp } from "./windowRegistry";

const RendererRoot: React.FC = () => {
  const RootApp = resolveRendererApp();

  return <RootApp />;
};

export default RendererRoot;
