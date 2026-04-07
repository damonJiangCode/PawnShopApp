import React from "react";
import { Box, Typography } from "@mui/material";

interface ClientBarProps {
  client_last_name?: string;
  client_first_name?: string;
  client_middle_name?: string;
}

const ClientBar: React.FC<ClientBarProps> = (props) => {
  const { client_last_name, client_first_name, client_middle_name } = props;
  const formattedClientName = [client_first_name, client_middle_name]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.toUpperCase())
    .join(" ");

  return (
    <Box>
      {client_last_name && client_first_name && (
        <Typography
          sx={{ variant: "subtitle2", color: "text.secondary", fontSize: 25 }}
        >
          {client_last_name.toUpperCase()}, {formattedClientName}
        </Typography>
      )}
    </Box>
  );
};

export default ClientBar;
