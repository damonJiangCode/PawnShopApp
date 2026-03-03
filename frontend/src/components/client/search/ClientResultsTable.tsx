import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import type { Client } from "../../../../../shared/types/Client";

interface ClientResultsTableProps {
  results: Client[];
  selectedClient?: Client | null;
  onSelect: (client: Client) => void;
}

type ResizeType = "last-first" | "first-dob";

const ClientResultsTable: React.FC<ClientResultsTableProps> = ({
  results,
  selectedClient,
  onSelect,
}) => {
  const minNameColumnWidth = 110;
  const minDobColumnWidth = 120;
  const [lastNameWidth, setLastNameWidth] = useState(170);
  const [firstNameWidth, setFirstNameWidth] = useState(150);
  const [dobWidth, setDobWidth] = useState(130);
  const dragStateRef = useRef<{
    startX: number;
    type: ResizeType;
    initialLastNameWidth: number;
    initialFirstNameWidth: number;
    initialDobWidth: number;
  } | null>(null);

  const handleResizeStart =
    (type: ResizeType) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      dragStateRef.current = {
        startX: event.clientX,
        type,
        initialLastNameWidth: lastNameWidth,
        initialFirstNameWidth: firstNameWidth,
        initialDobWidth: dobWidth,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dragState = dragStateRef.current;
        if (!dragState) {
          return;
        }

        const deltaX = moveEvent.clientX - dragState.startX;

        if (dragState.type === "last-first") {
          const nextLastNameWidth = Math.max(
            minNameColumnWidth,
            dragState.initialLastNameWidth + deltaX
          );
          const maxLastNameWidth =
            dragState.initialLastNameWidth +
            dragState.initialFirstNameWidth -
            minNameColumnWidth;
          const clampedLastNameWidth = Math.min(
            nextLastNameWidth,
            maxLastNameWidth
          );
          const nextFirstNameWidth =
            dragState.initialLastNameWidth +
            dragState.initialFirstNameWidth -
            clampedLastNameWidth;

          setLastNameWidth(clampedLastNameWidth);
          setFirstNameWidth(nextFirstNameWidth);
          return;
        }

        const nextFirstNameWidth = Math.max(
          minNameColumnWidth,
          dragState.initialFirstNameWidth + deltaX
        );
        const maxFirstNameWidth =
          dragState.initialFirstNameWidth +
          dragState.initialDobWidth -
          minDobColumnWidth;
        const clampedFirstNameWidth = Math.min(
          nextFirstNameWidth,
          maxFirstNameWidth
        );
        const nextDobWidth =
          dragState.initialFirstNameWidth +
          dragState.initialDobWidth -
          clampedFirstNameWidth;

        setFirstNameWidth(clampedFirstNameWidth);
        setDobWidth(nextDobWidth);
      };

      const handleMouseUp = () => {
        dragStateRef.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

  const resizeHandleSx = {
    position: "absolute",
    top: 0,
    right: -4,
    width: 8,
    height: "100%",
    cursor: "col-resize",
    zIndex: 2,
    "&::after": {
      content: '""',
      position: "absolute",
      top: 6,
      bottom: 6,
      left: "50%",
      width: "1px",
      backgroundColor: "divider",
      transform: "translateX(-50%)",
    },
  };

  return (
    <Paper
      sx={{
        flex: 1,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        minHeight: 0,
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <TableContainer sx={{ height: "100%", overflowY: "auto" }}>
        <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 80 }} />
            <col style={{ width: lastNameWidth }} />
            <col style={{ width: firstNameWidth }} />
            <col style={{ width: dobWidth }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 80 }}>#</TableCell>
              <TableCell
                sx={{
                  position: "relative",
                  userSelect: "none",
                }}
              >
                <Box sx={{ pr: 1.5 }}>Last Name</Box>
                <Box
                  onMouseDown={handleResizeStart("last-first")}
                  sx={resizeHandleSx}
                />
              </TableCell>
              <TableCell
                sx={{
                  position: "relative",
                  userSelect: "none",
                }}
              >
                <Box sx={{ pr: 1.5 }}>First Name</Box>
                <Box
                  onMouseDown={handleResizeStart("first-dob")}
                  sx={resizeHandleSx}
                />
              </TableCell>
              <TableCell sx={{ width: dobWidth }}>DoB</TableCell>
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
  );
};

export default ClientResultsTable;
