import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ItemLoadWindowApp from "./ItemLoadWindowApp.tsx";

const searchParams = new URLSearchParams(window.location.search);
const RootApp = searchParams.get("window") === "item-load" ? ItemLoadWindowApp : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);
