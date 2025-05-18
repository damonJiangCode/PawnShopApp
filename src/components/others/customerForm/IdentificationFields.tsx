import React from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Identification } from "../../../../shared/models/Customer";

interface IdentificationFieldsProps {
  identifications: Identification[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Identification, value: string) => void;
}

const IdentificationFields: React.FC<IdentificationFieldsProps> = ({
  identifications,
  onAdd,
  onRemove,
  onChange,
}) => (
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
        onClick={onAdd}
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
          {identifications?.map((id, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <FormControl fullWidth size="small">
                  <InputLabel>ID Type</InputLabel>
                  <Select
                    value={id.id_type}
                    label="ID Type"
                    onChange={(e) => onChange(idx, "id_type", e.target.value)}
                  >
                    <MenuItem value="passport">Passport</MenuItem>
                    <MenuItem value="idCard">ID Card</MenuItem>
                    <MenuItem value="driverLicense">Driver License</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={id.id_number}
                  onChange={(e) => onChange(idx, "id_number", e.target.value)}
                />
              </TableCell>
              <TableCell align="center">
                {identifications.length > 1 && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onRemove(idx)}
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

export default IdentificationFields;
