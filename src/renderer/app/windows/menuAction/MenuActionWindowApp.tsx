import React from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";

const MenuActionWindowApp: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "Menu Action";
  const actionId = params.get("actionId") || "";
  const description = params.get("description") || "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 2,
        bgcolor: "#f7f9fc",
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          height: "calc(100vh - 32px)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 2,
          boxSizing: "border-box",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>

        <Alert severity="info">
          This menu window is ready for implementation. Action ID:{" "}
          <strong>{actionId || "unknown"}</strong>
        </Alert>

        <Box sx={{ flex: 1, minHeight: 0 }} />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => window.close()}>
            Close
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MenuActionWindowApp;
