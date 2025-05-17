import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import HeightWeightFields from "./HeightWeightFields";
import NameFields from "./NameFields";

interface CustomerFormProps {
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
  weight_kg: undefined,
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

const CustomerForm: React.FC<CustomerFormProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [customer, setCustomer] = useState<Partial<Customer>>(defaultCustomer);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

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
              <NameFields
                lastName={customer.last_name}
                firstName={customer.first_name}
                middleName={customer.middle_name}
                onChange={handleInputChange}
              />

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
              <HeightWeightFields
                height_cm={customer.height_cm}
                weight_kg={customer.weight_kg}
                onHeightCmChange={(value) => {
                  setCustomer((prev) => ({ ...prev, height_cm: value }));
                }}
                onWeightKgChange={(value) => {
                  setCustomer((prev) => ({ ...prev, weight_kg: value }));
                }}
              />

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
              <PhotoCapture
                onCapture={handleCapture}
                id={customer.identifications?.[0]?.id_number || ""}
                idType={customer.identifications?.[0]?.id_type || ""}
              />
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

export default CustomerForm;
