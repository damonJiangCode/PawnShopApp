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
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { addCustomer } from "../../../backend/database/customersCRUD";

interface IdInfo {
  idType: string;
  idNumber: string;
}

export interface FormData {
  lastName: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  heightCm: string;
  heightFt: string;
  weightKg: string;
  weightLb: string;
  notes: string;
  picture: File | null;
  pictureUrl: string | null;
}

interface ClientAddFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData, ids: IdInfo[]) => void;
}

const defaultFormData: FormData = {
  lastName: "",
  firstName: "",
  middleName: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  province: "",
  country: "",
  postalCode: "",
  heightCm: "",
  heightFt: "",
  weightKg: "",
  weightLb: "",
  notes: "",
  picture: null,
  pictureUrl: null,
};

const ClientAddForm: React.FC<ClientAddFormProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [ids, setIds] = useState<IdInfo[]>([{ idType: "", idNumber: "" }]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastChanged, setLastChanged] = useState<
    "cm" | "ft" | "kg" | "lb" | null
  >(null);

  useEffect(() => {
    if (!open) {
      setFormData(defaultFormData);
      setIds([{ idType: "", idNumber: "" }]);
      setPreviewUrl(null);
    }
  }, [open]);

  // Height and weight conversion logic
  useEffect(() => {
    if (
      lastChanged === "cm" &&
      formData.heightCm &&
      !isNaN(+formData.heightCm) &&
      +formData.heightCm > 0
    ) {
      const ft = (parseFloat(formData.heightCm) / 30.48).toFixed(2);
      setFormData((prev) => ({ ...prev, heightFt: ft }));
    }
  }, [formData.heightCm]);

  useEffect(() => {
    if (
      lastChanged === "ft" &&
      formData.heightFt &&
      !isNaN(+formData.heightFt) &&
      +formData.heightFt > 0
    ) {
      const cm = (parseFloat(formData.heightFt) * 30.48).toFixed(2);
      setFormData((prev) => ({ ...prev, heightCm: cm }));
    }
  }, [formData.heightFt]);

  useEffect(() => {
    if (
      lastChanged === "kg" &&
      formData.weightKg &&
      !isNaN(+formData.weightKg) &&
      +formData.weightKg > 0
    ) {
      const lb = (parseFloat(formData.weightKg) * 2.20462).toFixed(2);
      setFormData((prev) => ({ ...prev, weightLb: lb }));
    }
  }, [formData.weightKg]);

  useEffect(() => {
    if (
      lastChanged === "lb" &&
      formData.weightLb &&
      !isNaN(+formData.weightLb) &&
      +formData.weightLb > 0
    ) {
      const kg = (parseFloat(formData.weightLb) / 2.20462).toFixed(2);
      setFormData((prev) => ({ ...prev, weightKg: kg }));
    }
  }, [formData.weightLb]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, picture: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addNewId = () =>
    setIds((prev) => [...prev, { idType: "", idNumber: "" }]);
  const removeId = (index: number) =>
    setIds((prev) => prev.filter((_, i) => i !== index));
  const handleIdChange = (
    index: number,
    field: keyof IdInfo,
    value: string
  ) => {
    setIds((prev) =>
      prev.map((id, i) => (i === index ? { ...id, [field]: value } : id))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCustomer = await addCustomer(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          country: formData.country,
          postalCode: formData.postalCode,
          heightCm: formData.heightCm,
          heightFt: formData.heightFt,
          weightKg: formData.weightKg,
          weightLb: formData.weightLb,
          notes: formData.notes,
          pictureUrl: formData.pictureUrl,
        },
        ids
      );
      console.log("New customer added:", newCustomer);
      onSave(newCustomer, ids);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 24 }}>
      {/* Main form content */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Left panel */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Name fields */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              fullWidth
              name="middleName"
              label="Middle Name"
              value={formData.middleName}
              onChange={handleInputChange}
              size="small"
            />
          </Box>
          {/* DOB & gender */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              name="dateOfBirth"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              size="small"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
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
              value={formData.address}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formData.city}
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
              value={formData.province}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              fullWidth
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              fullWidth
              name="postalCode"
              label="Postal Code"
              value={formData.postalCode}
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
            value={formData.notes}
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
            {!previewUrl && <PersonAddIcon fontSize="large" color="disabled" />}
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
              name="heightCm"
              label="Height (cm)"
              value={formData.heightCm}
              onChange={(e) => {
                setLastChanged("cm");
                setFormData((prev) => ({
                  ...prev,
                  heightCm: e.target.value,
                }));
              }}
              size="small"
            />
            <TextField
              fullWidth
              type="number"
              name="heightFt"
              label="Height (ft)"
              value={formData.heightFt}
              onChange={(e) => {
                setLastChanged("ft");
                setFormData((prev) => ({
                  ...prev,
                  heightFt: e.target.value,
                }));
              }}
              size="small"
            />
            <TextField
              fullWidth
              type="number"
              name="weightKg"
              label="Weight (kg)"
              value={formData.weightKg}
              onChange={(e) => {
                setLastChanged("kg");
                setFormData((prev) => ({
                  ...prev,
                  weightKg: e.target.value,
                }));
              }}
              size="small"
            />
            <TextField
              fullWidth
              type="number"
              name="weightLb"
              label="Weight (lb)"
              value={formData.weightLb}
              onChange={(e) => {
                setLastChanged("lb");
                setFormData((prev) => ({
                  ...prev,
                  weightLb: e.target.value,
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
              {ids.map((id, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel>ID Type</InputLabel>
                      <Select
                        value={id.idType}
                        label="ID Type"
                        onChange={(e) =>
                          handleIdChange(idx, "idType", e.target.value)
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
                      value={id.idNumber}
                      onChange={(e) =>
                        handleIdChange(idx, "idNumber", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    {ids.length > 1 && (
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
  );
};

export default ClientAddForm;
