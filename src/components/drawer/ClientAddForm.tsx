import React, { useState, useEffect, useRef } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Customer, Identification } from "../../../shared/models/Customer";
import PhotoCapture from "./PhotoCapture";
import CityProvinceCountryFields from "./CityProvinceCountryFields";

interface ClientAddFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

const defaultCustomer: Partial<Customer> = {
  first_name: "",
  last_name: "",
  middle_name: "",
  date_of_birth: undefined,
  gender: "",
  hair_color: "",
  eye_color: "",
  height_cm: undefined,
  height_ft: undefined,
  weight_kg: undefined,
  weight_lb: undefined,
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  country: "",
  postal_code: "",
  notes: "",
  picture_path: "",
  identifications: [{ id_type: "", id_number: "" }],
};

const ClientAddForm: React.FC<ClientAddFormProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [customer, setCustomer] = useState<Partial<Customer>>(defaultCustomer);
  const [lastChanged, setLastChanged] = useState<
    "cm" | "ft" | "kg" | "lb" | null
  >(null);

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
      const newCustomer = await (window as any).electronAPI.addCustomer(
        customer,
        customer.identifications || []
      );
      onSave(newCustomer);
      onClose();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  async function handleCapture(
    // fileName -= undefined or customerNumber
    // file name += _${customer.idifcation[0]['idtype']}_${customer.idifcation[0]['idnumber']}_${Date.now()}.png

    fileName: string,
    base64: string
  ): Promise<void> {
    console.log(fileName, base64);
    try {
      const relPath = await (window as any).electronAPI.saveCustomerImage(
        fileName,
        base64
      );
      console.log("relPath (ClientAddForm.tsx)", relPath);
      setCustomer((prev) => ({ ...prev, picture_path: relPath }));
    } catch (error) {
      console.error("Error saving customer image (ClientAddForm.tsx):", error);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {/* Main form content */}
          <Box sx={{ display: "flex", gap: 2, py: 1 }}>
            {/* Left panel */}
            <Box
              sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Name fields */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  name="last_name"
                  label="Last Name"
                  value={customer.last_name}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  required
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
                  required
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
                  <InputLabel required>Gender</InputLabel>
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
                    <MenuItem value="male">male</MenuItem>
                    <MenuItem value="female">female</MenuItem>
                    <MenuItem value="other">other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel required>Hair Color</InputLabel>
                  <Select
                    name="hair_color"
                    value={customer.hair_color}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleInputChange({
                        target: { name, value },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    label="Hair Color"
                  >
                    <MenuItem value="" />
                    <MenuItem value="male">male</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel required>Eye Color</InputLabel>
                  <Select
                    name="eye_color"
                    value={customer.eye_color}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleInputChange({
                        target: { name, value },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    label="Eye Color"
                  >
                    <MenuItem value="" />
                    <MenuItem value="male">male</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Height & weight */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  required
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
                  required
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
                  required
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
                  required
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

              {/* Address & postal code */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label="Address"
                  value={customer.address}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  required
                  fullWidth
                  name="postal_code"
                  label="Postal Code"
                  value={customer.postal_code}
                  onChange={handleInputChange}
                  size="small"
                />
              </Box>

              {/* City & rovince & country */}
              <CityProvinceCountryFields
                customer_city="Saskatoon"
                customer_province="Saskatchewan"
                customer_country="Canada"
                onChange={handleInputChange}
              />

              {/* Email & phone */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={customer.email}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  value={customer.phone}
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
                gap: 1,
              }}
            >
              <PhotoCapture onCapture={handleCapture} />
            </Box>
          </Box>
          {/* Bottom panel */}
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
