import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Customer, Identification } from "../../../../shared/models/Customer";
import PhotoCapture from "./PhotoCapture";
import HeightWeightFields from "./HeightWeightFields";
import NameFields from "./NameFields";
import DobGenderColor from "./DobGenderColor";
import AddressFields from "./AddressFields";
import ContactNotesFields from "./ContactNotesFields";
import IdentificationFields from "./IdentificationFields";

interface CustomerFormProps {
  existed_customer?: Customer;
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
  existed_customer,
  open,
  onClose,
  onSave,
}) => {
  const [customer, setCustomer] = useState<Partial<Customer>>(
    existed_customer || defaultCustomer
  );

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
    console.log("customer form change (CustomerForm.tsx):", name, value);
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

              {/* DOB & gender & hair color & eye color */}
              <DobGenderColor
                date_of_birth={customer.date_of_birth}
                gender={customer.gender}
                hair_color={customer.hair_color}
                eye_color={customer.eye_color}
                onChange={handleInputChange}
              />

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

              {/* Address & postal code & city & province & country */}
              <AddressFields
                customer_address={customer.address}
                customer_postal_code={customer.postal_code}
                customer_city={customer.city || "Saskatoon"}
                customer_province={customer.province || "Saskatchewan"}
                customer_country={customer.country || "Canada"}
                onChange={handleInputChange}
              />

              {/* Email & phone & notes */}
              <ContactNotesFields
                email={customer.email}
                phone={customer.phone}
                notes={customer.notes}
                onChange={handleInputChange}
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
            </Box>
            <IdentificationFields
              identifications={customer.identifications || []}
              onAdd={addNewId}
              onRemove={removeId}
              onChange={handleIdChange}
            />
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
