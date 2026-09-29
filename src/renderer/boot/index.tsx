import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import RendererApp from "./RendererApp";

const appTheme = createTheme({
  palette: {
    background: {
      default: "#e6eaef",
      paper: "#f1f3f5",
    },
  },
  shape: { borderRadius: 6 },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RendererApp />
    </ThemeProvider>
  </StrictMode>,
);
