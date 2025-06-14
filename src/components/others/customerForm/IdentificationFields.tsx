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
import { Identification } from "../../../../shared/models/Customer";

export interface IdentificationFieldsRef {
  getIdentifications: () => Identification[];
}

interface IdentificationFieldsProps {
  initialIdentifications: Identification[];
}

const IdentificationFields = forwardRef<
  IdentificationFieldsRef,
  IdentificationFieldsProps
>(({ initialIdentifications }, ref) => {
  const [identifications, setIdentifications] = useState<Identification[]>(
    initialIdentifications
  );

  const [idTypes, setIdTypes] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const types = await (window as any).electronAPI.getIdTypes();
        setIdTypes(types);
      } catch (err) {
        setIdTypes([]);
      }
    })();
  }, []);

  useImperativeHandle(ref, () => ({
    getIdentifications: () => identifications,
  }));

  const handleAdd = () => {
    setIdentifications([...identifications, { id_type: "", id_number: "" }]);
  };

  const handleRemove = (index: number) => {
    setIdentifications(identifications.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    field: keyof Identification,
    value: string
  ) => {
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
                      handleFieldChange(idx, "id_type", e.target.value)
                    }
                  >
                    {idTypes.map((type) => (
                      <MenuItem key={type} value={type}>
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
                      handleFieldChange(idx, "id_number", e.target.value)
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

export default IdentificationFields;
