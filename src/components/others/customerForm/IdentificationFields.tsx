import React, { useState, useImperativeHandle, forwardRef } from "react";
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
                    <MenuItem value="passport">Passport</MenuItem>
                    <MenuItem value="idCard">ID Card</MenuItem>
                    <MenuItem value="driverLicense">Driver License</MenuItem>
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
