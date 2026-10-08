import type { ClientLookup } from "../../../shared/utils/clientLookup";
import React from "react";
import { Box } from "@mui/material";
import SearchBar from "./SearchBar";
import SideButtons from "./SideButtons";

interface TopBarProps {
  onSearch?: (params: { firstName: string; lastName: string }) => void;
  onBirthdaySearch?: (params: { dateOfBirth: string }) => void;
  onLookupSearch?: (lookup: ClientLookup) => void;
  onClear?: () => void;
  onPayment?: () => void;
  onTicketSearch?: () => void;
  onItemSearch?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  onSearch,
  onBirthdaySearch,
  onLookupSearch,
  onClear,
  onPayment,
  onTicketSearch,
  onItemSearch,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "nowrap",
        px: 1.5,
        py: 1,
        minWidth: 0,
      }}
    >
      <SearchBar
        onSearch={onSearch}
        onBirthdaySearch={onBirthdaySearch}
        onLookupSearch={onLookupSearch}
        onClear={onClear}
      />
      <SideButtons
        onPayment={onPayment}
        onTicketSearch={onTicketSearch}
        onItemSearch={onItemSearch}
      />
    </Box>
  );
};

export default TopBar;
