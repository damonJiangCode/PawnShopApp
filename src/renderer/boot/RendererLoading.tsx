import { Box, CircularProgress } from "@mui/material";

const RendererLoading = () => {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress size={34} aria-hidden="true" />
    </Box>
  );
};

export default RendererLoading;
