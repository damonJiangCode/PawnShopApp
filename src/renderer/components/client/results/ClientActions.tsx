import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { Client } from "../../../../shared/types/Client";
import ClientAddEditDialog from "../dialogs/ClientAddEditDialog";

interface ClientActionsProps {
  client: Client | null;
  onClientCreated?: (client: Client) => void;
  onClientUpdated?: (client: Client) => void;
}

const ClientActions: React.FC<ClientActionsProps> = ({
  client,
  onClientCreated,
  onClientUpdated,
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          width: 78,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
          sx={{
            minWidth: 0,
            justifyContent: "flex-start",
            px: 1,
            "&:hover": {
              boxShadow: 3,
            },
          }}
        >
          Add
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon />}
          disabled={!client?.client_number}
          onClick={() => setEditOpen(true)}
          sx={{
            minWidth: 0,
            justifyContent: "flex-start",
            px: 1,
            "&:hover": {
              boxShadow: 3,
            },
          }}
        >
          Edt
        </Button>
      </Box>

      {addOpen && (
        <ClientAddEditDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={(createdClient) => {
            onClientCreated?.(createdClient);
            setAddOpen(false);
          }}
        />
      )}

      {editOpen && client && (
        <ClientAddEditDialog
          clientExisted={client}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={(updatedClient) => {
            onClientUpdated?.(updatedClient);
            setEditOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ClientActions;
