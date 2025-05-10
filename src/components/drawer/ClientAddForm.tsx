import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Customer, Identification } from "../../../shared/models/Customer";

interface ClientAddFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

const defaultCustomer: Partial<Customer> = {
  first_name: undefined,
  last_name: undefined,
  middle_name: undefined,
  date_of_birth: undefined,
  gender: undefined,
  address: undefined,
  city: undefined,
  province: undefined,
  country: undefined,
  postal_code: undefined,
  height_cm: undefined,
  height_ft: undefined,
  weight_kg: undefined,
  weight_lb: undefined,
  notes: undefined,
  picture_url: undefined,
  identifications: [{ id_type: undefined, id_number: undefined }],
};

const ClientAddForm: React.FC<ClientAddFormProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [customer, setCustomer] = useState<Partial<Customer>>(defaultCustomer);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastChanged, setLastChanged] = useState<
    "cm" | "ft" | "kg" | "lb" | null
  >(null);

  useEffect(() => {
    if (!open) {
      setCustomer(defaultCustomer);
      setPreviewUrl(null);
    }
  }, [open]);

  // Height and weight conversion logic
  useEffect(() => {
    if (
      lastChanged === "cm" &&
      customer.height_cm &&
      !isNaN(customer.height_cm) &&
      customer.height_cm > 0
    ) {
      const ft = (customer.height_cm / 30.48).toFixed(2);
      setCustomer((prev) => ({ ...prev, height_ft: parseFloat(ft) }));
    }
  }, [customer.height_cm]);

  useEffect(() => {
    if (
      lastChanged === "ft" &&
      customer.height_ft &&
      !isNaN(customer.height_ft) &&
      customer.height_ft > 0
    ) {
      const cm = (customer.height_ft * 30.48).toFixed(2);
      setCustomer((prev) => ({ ...prev, height_cm: parseFloat(cm) }));
    }
  }, [customer.height_ft]);

  useEffect(() => {
    if (
      lastChanged === "kg" &&
      customer.weight_kg &&
      !isNaN(customer.weight_kg) &&
      customer.weight_kg > 0
    ) {
      const lb = (customer.weight_kg * 2.20462).toFixed(2);
      setCustomer((prev) => ({ ...prev, weight_lb: parseFloat(lb) }));
    }
  }, [customer.weight_kg]);

  useEffect(() => {
    if (
      lastChanged === "lb" &&
      customer.weight_lb &&
      !isNaN(customer.weight_lb) &&
      customer.weight_lb > 0
    ) {
      const kg = (customer.weight_lb / 2.20462).toFixed(2);
      setCustomer((prev) => ({ ...prev, weight_kg: parseFloat(kg) }));
    }
  }, [customer.weight_lb]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setCustomer((prev) => ({
          ...prev,
          picture_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewId = () =>
    setCustomer((prev) => ({
      ...prev,
      identifications: [
        ...(prev.identifications || []),
        { id_type: "", id_number: "" },
      ],
    }));

  const removeId = (index: number) =>
    setCustomer((prev) => ({
      ...prev,
      identifications: prev.identifications?.filter((_, i) => i !== index),
    }));

  const handleIdChange = (
    index: number,
    field: keyof Identification,
    value: string
  ) => {
    setCustomer((prev) => ({
      ...prev,
      identifications: prev.identifications?.map((id, i) =>
        i === index ? { ...id, [field]: value } : id
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCustomer = (window as any).electronAPI.addCustomer(
        customer,
        customer.identifications || []
      );
      console.log("customer", customer);
      console.log("customer.identifications", customer.identifications);
      onSave(newCustomer);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {/* Main form content */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Left panel */}
            <Box
              sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Name fields */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  name="last_name"
                  label="Last Name"
                  value={customer.last_name}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  name="first_name"
                  label="First Name"
                  value={customer.first_name}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  name="middle_name"
                  label="Middle Name"
                  value={customer.middle_name}
                  onChange={handleInputChange}
                  size="small"
                />
              </Box>
              {/* DOB & gender */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  type="date"
                  name="date_of_birth"
                  label="Date of Birth"
                  value={
                    customer.date_of_birth
                      ? new Date(customer.date_of_birth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={customer.gender}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleInputChange({
                        target: { name, value },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    label="Gender"
                  >
                    <MenuItem value="" />
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {/* Address & city */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  value={customer.address}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={customer.city}
                  onChange={handleInputChange}
                  size="small"
                />
              </Box>
              {/* Province, country, postal */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  name="province"
                  label="Province"
                  value={customer.province}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  name="country"
                  label="Country"
                  value={customer.country}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  name="postal_code"
                  label="Postal Code"
                  value={customer.postal_code}
                  onChange={handleInputChange}
                  size="small"
                />
              </Box>
              {/* Notes */}
              <TextField
                fullWidth
                multiline
                rows={4}
                name="notes"
                label="Notes"
                value={customer.notes}
                onChange={handleInputChange}
                size="small"
              />
            </Box>
            {/* Right panel */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={previewUrl || undefined}
                sx={{ width: 80, height: 80, bgcolor: "grey.200" }}
              >
                {!previewUrl && (
                  <PersonAddIcon fontSize="large" color="disabled" />
                )}
              </Avatar>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                size="small"
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePictureChange}
                />
              </Button>
              {/* Height and weight input fields */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                  width: "50%",
                }}
              >
                <TextField
                  fullWidth
                  type="number"
                  name="height_cm"
                  label="Height (cm)"
                  value={customer.height_cm || ""}
                  onChange={(e) => {
                    setLastChanged("cm");
                    setCustomer((prev) => ({
                      ...prev,
                      height_cm: parseFloat(e.target.value),
                    }));
                  }}
                  size="small"
                />
                <TextField
                  fullWidth
                  type="number"
                  name="height_ft"
                  label="Height (ft)"
                  value={customer.height_ft || ""}
                  onChange={(e) => {
                    setLastChanged("ft");
                    setCustomer((prev) => ({
                      ...prev,
                      height_ft: parseFloat(e.target.value),
                    }));
                  }}
                  size="small"
                />
                <TextField
                  fullWidth
                  type="number"
                  name="weight_kg"
                  label="Weight (kg)"
                  value={customer.weight_kg || ""}
                  onChange={(e) => {
                    setLastChanged("kg");
                    setCustomer((prev) => ({
                      ...prev,
                      weight_kg: parseFloat(e.target.value),
                    }));
                  }}
                  size="small"
                />
                <TextField
                  fullWidth
                  type="number"
                  name="weight_lb"
                  label="Weight (lb)"
                  value={customer.weight_lb || ""}
                  onChange={(e) => {
                    setLastChanged("lb");
                    setCustomer((prev) => ({
                      ...prev,
                      weight_lb: parseFloat(e.target.value),
                    }));
                  }}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          {/* IDs Section */}
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
                onClick={addNewId}
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
                  {customer.identifications?.map((id, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <InputLabel>ID Type</InputLabel>
                          <Select
                            value={id.id_type}
                            label="ID Type"
                            onChange={(e) =>
                              handleIdChange(idx, "id_type", e.target.value)
                            }
                          >
                            <MenuItem value="passport">Passport</MenuItem>
                            <MenuItem value="idCard">ID Card</MenuItem>
                            <MenuItem value="driverLicense">
                              Driver License
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={id.id_number}
                          onChange={(e) =>
                            handleIdChange(idx, "id_number", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        {customer.identifications &&
                          customer.identifications.length > 1 && (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => removeId(idx)}
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
          <Divider sx={{ my: 3 }} />
          {/* Footer Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientAddForm;
