import React from "react";
import { Alert, Box } from "@mui/material";
import MenuActionPlaceholder from "./MenuActionPlaceholder";
import { menuActionRegistry } from "./menuActionRegistry";

const MenuActionWindowApp: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "Menu Action";
  const actionId = params.get("actionId") || "";
  const description = params.get("description") || "";
  const RegisteredAction = actionId ? menuActionRegistry[actionId] : undefined;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 2,
        bgcolor: "#f7f9fc",
        boxSizing: "border-box",
      }}
    >
      {RegisteredAction ? (
        <RegisteredAction actionId={actionId} />
      ) : (
        <MenuActionPlaceholder
          actionId={actionId || "unknown"}
          title={title}
          description={description || "No registered menu action was found."}
        >
          <Alert severity="warning">
            This action is not registered in the menu action registry.
          </Alert>
        </MenuActionPlaceholder>
      )}
    </Box>
  );
};

export default MenuActionWindowApp;
