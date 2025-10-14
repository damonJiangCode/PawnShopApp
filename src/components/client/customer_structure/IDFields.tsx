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
import { ID } from "../../../../shared/models/Customer.ts";

export interface IDFieldsRef {
  getIDs: () => ID[];
}

interface IDFieldsProps {
  ids: ID[];
}

const IDFields = forwardRef<IDFieldsRef, IDFieldsProps>(({ ids }, ref) => {
  const [identifications, setIdentifications] = useState<ID[]>(ids);
  const [idTypes, setIdTypes] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    getIDs: () => identifications,
  }));

  // Fetch ID types on mount
  useEffect(() => {
    const fetchIdTypes = async () => {
      try {
        const types = await (window as any).electronAPI.getIdTypes();
        setIdTypes(types);
        // console.log("Fetched ID types:", types);
      } catch (err) {
        setIdTypes([]);
        console.error("Failed to fetch ID types: (IDFields.tsx)", err);
        alert("Failed to fetch ID types. Please try again.");
      }
    };
    fetchIdTypes();
    // only run once on mount
  }, []);

  const handleAdd = () => {
    setIdentifications([...identifications, { id_type: "", id_number: "" }]);
  };

  const handleRemove = (index: number) => {
    setIdentifications(identifications.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof ID, value: string) => {
    // console.log("Updating ID field:", { index, field, value });
    setIdentifications((prev) =>
      prev.map((element, i) =>
        i === index ? { ...element, [field]: value } : element
      )
    );
  };

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
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Number</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {identifications.length > 0 &&
              identifications.map((element, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="id_type"
                      label="ID Type"
                      value={
                        idTypes.includes(element.id_type) ? element.id_type : ""
                      }
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
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      name="id_number"
                      label="ID Number"
                      value={element.id_number || ""}
                      onChange={(e) =>
                        handleUpdate(i, "id_number", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default IDFields;
