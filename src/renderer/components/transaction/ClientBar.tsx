import React from "react";
import { Box, Typography } from "@mui/material";

interface ClientBarProps {
  client_last_name?: string;
  client_first_name?: string;
}

const ClientBar: React.FC<ClientBarProps> = (props) => {
  const { client_last_name, client_first_name } = props;
  return (
    <Box>
      {client_last_name && client_first_name && (
        <Typography
          sx={{ variant: "subtitle2", color: "text.secondary", fontSize: 25 }}
        >
          {client_last_name.toUpperCase()}, {client_first_name.toUpperCase()}
        </Typography>
      )}
    </Box>
  );
};

export default ClientBar;
