import React from "react";
import { Box } from "@mui/material";
import SearchBar from "./SearchBar";
import SideButtons from "./SideButtons";

interface TopBarProps {
  onSearch?: (params: { firstName: string; lastName: string }) => void;
  onClear?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, onClear }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 1.5,
        py: 1,
      }}
    >
      <SearchBar onSearch={onSearch} onClear={onClear} />
      <SideButtons />
    </Box>
  );
};

export default TopBar;
