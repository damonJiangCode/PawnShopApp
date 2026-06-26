import React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

export type MenuActionLayoutProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const MenuActionLayout: React.FC<MenuActionLayoutProps> = ({
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
      <Box className="no-print" sx={{ displayPrint: "none" }}>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pt: 1 }}>
        {children}
      </Box>

      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        className="no-print"
        sx={{ displayPrint: "none" }}
      >
        <Button variant="outlined" onClick={() => window.close()}>
          Close
        </Button>
      </Stack>
    </Paper>
  );
};

export default MenuActionLayout;
