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
import { ID } from "../../../../shared/models/Customer";

const defaultIDs: ID[] = [
  { id_type: "", id_number: "" },
  { id_type: "", id_number: "" },
];

export interface IDFieldsRef {
  getIDs: () => ID[];
}

interface IDFieldsProps {
  ids?: ID[];
}

const IDFields = forwardRef<IDFieldsRef, IDFieldsProps>(({ ids }, ref) => {
  const [identifications, setIdentifications] = useState<ID[]>(
    ids || defaultIDs
  );
  const [idTypes, setIdTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchIdTypes = async () => {
      try {
        const types = await (window as any).electronAPI.getIdTypes();
        setIdTypes(types);
        // console.log("Fetched ID types:", types);
      } catch (err) {
        setIdTypes([]);
        console.error("Failed to fetch ID types: (IDFields.tsx)", err);
      }
    };
    fetchIdTypes();
  }, []);

  useImperativeHandle(ref, () => ({
    getIDs: () => identifications,
  }));

  const handleAdd = () => {
    setIdentifications([...identifications, { id_type: "", id_number: "" }]);
  };

  const handleRemove = (index: number) => {
    setIdentifications(identifications.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof ID, value: string) => {
    setIdentifications((prev) =>
      prev.map((id, i) => (i === index ? { ...id, [field]: value } : id))
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
              <TableCell>Type</TableCell>
              <TableCell>Number</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {identifications.map((id, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    name="id_type"
                    label="ID Type"
                    value={id.id_type}
                    onChange={(e) =>
                      handleUpdate(idx, "id_type", e.target.value)
                    }
                  >
                    {idTypes.map((type, i) => (
                      <MenuItem key={`${idx}-${i}-${type}`} value={type}>
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
                    value={id.id_number}
                    onChange={(e) =>
                      handleUpdate(idx, "id_number", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  {identifications.length > 2 && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemove(idx)}
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
