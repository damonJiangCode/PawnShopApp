import React from "react";
import { Alert, Box } from "@mui/material";
import MenuWindowLayout from "../../shared/layout/MenuWindowLayout";
import { windowHostRegistry } from "./windowHostRegistry";

const WindowHostApp: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen") ?? "";
  const title = params.get("title") || "Window";
  const description = params.get("description") || "";
  const ScreenComponent = windowHostRegistry[screen];

  if (ScreenComponent) {
    return <ScreenComponent screen={screen} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 2,
        bgcolor: "#f7f9fc",
        boxSizing: "border-box",
      }}
    >
      <MenuWindowLayout
        title={title}
        description={description || "No registered window screen was found."}
      >
        <Alert severity="warning">
          This window screen is not registered in the window host registry.
        </Alert>
      </MenuWindowLayout>
    </Box>
  );
};

export default WindowHostApp;
