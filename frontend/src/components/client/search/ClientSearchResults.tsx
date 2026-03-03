import { Box } from "@mui/material";
import type { Client } from "../../../../../shared/types/Client";
import ClientResultsTable from "./ClientResultsTable";
import ClientSearchImagePreview from "./ClientSearchImagePreview";

interface ClientSearchResultsProps {
  results: Client[];
  selectedClient?: Client | null;
  onSelect: (client: Client) => void;
  onClientUpdated?: (client: Client) => void;
}

const ClientSearchResults: React.FC<ClientSearchResultsProps> = ({
  results,
  selectedClient,
  onSelect,
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
      <ClientResultsTable
        results={results}
        selectedClient={selectedClient}
        onSelect={onSelect}
      />

      <ClientSearchImagePreview
        client={previewClient}
        onClientUpdated={onClientUpdated}
      />
    </Box>
  );
};

export default ClientSearchResults;
