import React from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";

export type MenuActionPlaceholderProps = {
  actionId: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

const MenuActionPlaceholder: React.FC<MenuActionPlaceholderProps> = ({
  actionId,
  title,
  description,
  children,
}) => {
  return (
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
        overflow: "hidden",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {!children && (
        <Alert severity="info">
          Placeholder ready for implementation. Action ID:{" "}
          <strong>{actionId}</strong>
        </Alert>
      )}

      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pt: 1 }}>
        {children}
      </Box>

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => window.close()}>
          Close
        </Button>
      </Stack>
    </Paper>
  );
};

export default MenuActionPlaceholder;
