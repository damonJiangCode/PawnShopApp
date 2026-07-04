import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RendererRoot from "./RendererRoot";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RendererRoot />
  </StrictMode>,
);
