import { Box } from "@mui/material";
import type { Client } from "../../../../../shared/types/Client";
import ClientTable from "./ClientTable";
import ClientImagePreview from "./ClientImagePreview";

interface ClientResultProps {
  results: Client[];
  selectedClient?: Client | null;
  onSelect: (client: Client) => void;
  onClientCreated?: (client: Client) => void;
  onClientUpdated?: (client: Client) => void;
  onClientDeleted?: (clientNumber: number) => void;
}

const ClientResult: React.FC<ClientResultProps> = ({
  results,
  selectedClient,
  onSelect,
  onClientCreated,
  onClientUpdated,
  onClientDeleted,
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
      <ClientTable
        results={results}
        selectedClient={selectedClient}
        onSelect={onSelect}
      />

      <ClientImagePreview
        client={previewClient}
        onClientCreated={onClientCreated}
        onClientUpdated={onClientUpdated}
        onClientDeleted={onClientDeleted}
      />
    </Box>
  );
};

export default ClientResult;
