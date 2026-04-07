import React from "react";
import { Box, Paper } from "@mui/material";
import type { Client } from "../../../../shared/types/Client";
import ClientsTable from "./ClientsTable";
import ClientImage from "./ClientImage";
import ClientActions from "./ClientActions";

interface ClientsPanelProps {
  results: Client[];
  selectedClient?: Client | null;
  onSelect: (client: Client) => void;
  onClientCreated?: (client: Client) => void;
  onClientUpdated?: (client: Client) => void;
}

const ClientsPanel: React.FC<ClientsPanelProps> = ({
  results,
  selectedClient,
  onSelect,
  onClientCreated,
  onClientUpdated,
}) => {
  const previewClient = selectedClient ?? results[0] ?? null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.75,
        height: "100%",
        minHeight: 0,
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      <ClientsTable
        clients={results}
        selectedClient={selectedClient}
        onClientSelect={onSelect}
      />

      <Paper
        sx={{
          width: 306,
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
        <ClientImage client={previewClient} />
        <ClientActions
          client={previewClient}
          onClientCreated={onClientCreated}
          onClientUpdated={onClientUpdated}
        />
      </Paper>
    </Box>
  );
};

export default ClientsPanel;
