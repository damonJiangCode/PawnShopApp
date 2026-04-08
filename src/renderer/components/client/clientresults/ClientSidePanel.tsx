import React from "react";
import { Paper } from "@mui/material";
import type { Client } from "../../../../shared/types/Client";
import { CLIENT_SIDE_PANEL_WIDTH } from "../../../utils/layoutSizing";
import ClientActions from "./ClientActions";
import ClientImage from "./ClientImage";

interface ClientSidePanelProps {
  client: Client | null;
  onClientCreated?: (client: Client) => void;
  onClientUpdated?: (client: Client) => void;
}

const ClientSidePanel: React.FC<ClientSidePanelProps> = ({
  client,
  onClientCreated,
  onClientUpdated,
}) => {
  return (
    <Paper
      sx={{
        width: CLIENT_SIDE_PANEL_WIDTH,
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        minHeight: 0,
        height: "100%",
        overflow: "hidden",
        flexShrink: 0,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "stretch",
        gap: 0.75,
        p: 0.75,
      }}
    >
      <ClientImage client={client} />
      <ClientActions
        client={client}
        onClientCreated={onClientCreated}
        onClientUpdated={onClientUpdated}
      />
    </Paper>
  );
};

export default ClientSidePanel;
