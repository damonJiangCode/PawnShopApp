import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Client } from "../../../../../shared/types/Client";
import { useClientImage } from "../../../hooks/useClientImage";
import ClientForm from "../ClientForm";
import EditIcon from "@mui/icons-material/Edit";

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
    <Box sx={{ display: "flex", gap: 1.5, height: "100%", minHeight: 0, alignItems: "stretch" }}>
      <Paper
        sx={{
          flex: 1,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <TableContainer sx={{ height: "100%" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80 }}>#</TableCell>
                <TableCell>Last</TableCell>
                <TableCell>First</TableCell>
                <TableCell sx={{ width: 140 }}>Phone</TableCell>
                <TableCell sx={{ width: 140 }}>City</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">No results.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results.map((client) => {
                  const selected =
                    selectedClient?.client_number === client.client_number;
                  return (
                    <TableRow
                      key={client.client_number}
                      hover
                      selected={selected}
                      onClick={() => onSelect(client)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{client.client_number}</TableCell>
                      <TableCell>{client.last_name?.toUpperCase()}</TableCell>
                      <TableCell>{client.first_name?.toUpperCase()}</TableCell>
                      <TableCell>
                        {client.date_of_birth.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ClientImagePreview
        client={previewClient}
        onClientUpdated={onClientUpdated}
      />
    </Box>
  );
};

const ClientImagePreview: React.FC<{
  client: Client | null;
  onClientUpdated?: (client: Client) => void;
}> = ({ client, onClientUpdated }) => {
  const imageSrc = useClientImage(client?.image_path);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Paper
      sx={{
        width: 210,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        minHeight: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt="Client"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography color="text.secondary">No Image</Typography>
        )}
      </Box>
      <IconButton
        size="small"
        color="primary"
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          backgroundColor: "rgba(255,255,255,0.92)",
          "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
        }}
        disabled={!client?.client_number}
        onClick={() => setEditOpen(true)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      {editOpen && client && (
        <ClientForm
          clientExisted={client}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={(updatedClient) => {
            onClientUpdated?.(updatedClient);
            setEditOpen(false);
          }}
        />
      )}
    </Paper>
  );
};

export default ClientSearchResults;
