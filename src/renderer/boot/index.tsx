import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import RendererApp from "./RendererApp";

const appTheme = createTheme({
  palette: {
    background: {
      default: "#ffffff",
      paper: "#ffffff",
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
