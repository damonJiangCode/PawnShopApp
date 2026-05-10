import React from "react";
import { Box } from "@mui/material";
import SearchBar from "./SearchBar";
import SideButtons from "./SideButtons";

interface TopBarProps {
  onSearch?: (params: { firstName: string; lastName: string }) => void;
  onClear?: () => void;
  onPayment?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, onClear, onPayment }) => {
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
      <SideButtons onPayment={onPayment} />
    </Box>
  );
};

export default TopBar;
