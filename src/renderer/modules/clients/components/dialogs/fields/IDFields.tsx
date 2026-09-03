import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ID } from "../../../../../../shared/models/client.model";
import { clientApi } from "../../../client.api";

export interface IDFieldsRef {
  getIDs: () => ID[];
}

interface IDFieldsProps {
  ids: ID[];
  error?: string;
  onIdsChange?: () => void;
}

const IDFields = forwardRef<IDFieldsRef, IDFieldsProps>(
  ({ ids, error, onIdsChange }, ref) => {
    const [identifications, setIdentifications] = useState<ID[]>(ids);
    const [idTypes, setIdTypes] = useState<string[]>([]);
    const [idTypeLoadError, setIdTypeLoadError] = useState("");
    const showFieldErrors = Boolean(error);

    useImperativeHandle(ref, () => ({
      getIDs: () => identifications,
    }));

    useEffect(() => {
      let active = true;

      const fetchIdTypes = async () => {
        try {
          const types = await clientApi.loadIdTypes();
          if (active) {
            setIdTypes(types);
          }
        } catch (err) {
          if (!active) return;
          console.error("Failed to load ID types", err);
          setIdTypeLoadError(
            err instanceof Error ? err.message : "Unable to load ID types.",
          );
        }
      };

      void fetchIdTypes();

      return () => {
        active = false;
      };
    }, []);

    useEffect(() => {
      setIdentifications(ids);
    }, [ids]);

    useEffect(() => {
      if (identifications.length >= 2) return;
      setIdentifications((prev) => {
        const next = [...prev];
        while (next.length < 2) {
          next.push({ id_type: "", id_value: "" });
        }
        return next;
      });
    }, [identifications.length]);

    const handleAdd = () => {
      onIdsChange?.();
      setIdentifications([...identifications, { id_type: "", id_value: "" }]);
    };

    const handleRemove = (index: number) => {
      onIdsChange?.();
      setIdentifications(identifications.filter((_, i) => i !== index));
    };

    const handleUpdate = (index: number, field: keyof ID, value: string) => {
      onIdsChange?.();
      setIdentifications((prev) =>
        prev.map((element, i) =>
          i === index ? { ...element, [field]: value } : element,
        ),
      );
    };

    const getTypeError = (id: ID) =>
      showFieldErrors && !id.id_type?.trim() ? "ID type is required." : "";

    const getNumberError = (id: ID) =>
      showFieldErrors && !id.id_value?.trim() ? "ID number is required." : "";

    return (
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1">ID Information</Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add ID
          </Button>
        </Box>

        <TableContainer component="div" sx={{ mt: 1 }}>
          <Table size="small" sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderBottom: "none", width: 250 }}
                >
                  Type
                </TableCell>
                <TableCell align="left" sx={{ borderBottom: "none" }}>
                  Number
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", width: 88 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {identifications.length > 0 &&
                identifications.map((element, i) => {
                  const typeError = getTypeError(element);
                  const numberError = getNumberError(element);

                  return (
                    <TableRow key={i}>
                      <TableCell sx={{ borderBottom: "none", width: 180 }}>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          name="id_type"
                          label="ID Type"
                          value={
                            idTypes.includes(element.id_type)
                              ? element.id_type
                              : ""
                          }
                          error={Boolean(typeError)}
                          helperText={typeError || " "}
                          onChange={(e) =>
                            handleUpdate(i, "id_type", e.target.value)
                          }
                        >
                          <MenuItem value="">Select an ID Type</MenuItem>
                          {idTypes.map((type, type_idx) => (
                            <MenuItem key={type_idx} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "none" }}>
                        <TextField
                          fullWidth
                          size="small"
                          name="id_value"
                          label="ID Number"
                          value={element.id_value || ""}
                          error={Boolean(numberError)}
                          helperText={numberError || " "}
                          onChange={(e) =>
                            handleUpdate(i, "id_value", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "none", width: 88 }}
                      >
                        {identifications.length > 2 && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemove(i)}
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography
          variant="body2"
          color={error || idTypeLoadError ? "error" : "text.secondary"}
          sx={{ mt: 1, minHeight: 20 }}
        >
          {error || idTypeLoadError || " "}
        </Typography>
      </Box>
    );
  },
);

export default IDFields;
