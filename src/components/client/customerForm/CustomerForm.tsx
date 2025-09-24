import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Customer, ID } from "../../../../shared/models/Customer";
import PhotoCapture from "./PhotoCapture";
import HeightWeightFields from "./HeightWeightFields";
import NameFields from "./NameFields";
import DobGenderColor from "./DobGenderColor";
import AddressFields from "./AddressFields";
import ContactNotesFields from "./ContactNotesFields";
import IDFields, { IDFieldsRef } from "./IDFields";

const defaultCustomer: Customer = {
  first_name: "",
  last_name: "",
  middle_name: "",
  date_of_birth: new Date(
    new Date().getFullYear() - 18,
    new Date().getMonth(),
    new Date().getDate()
  ),
  gender: "",
  hair_color: "",
  eye_color: "",
  height_cm: undefined,
  weight_kg: undefined,
  email: "",
  phone: "",
  address: "",
  city: "Saskatoon",
  province: "Saskatchewan",
  country: "Canada",
  postal_code: "",
  notes: "",
  picture_path: "",
  updated_at: new Date(),
};

interface CustomerFormProps {
  existed_customer?: Customer;
  open: boolean;
  onSave: (args: { updatedCustomer: Customer; updatedIDs: ID[] }) => void;
  onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  existed_customer,
  open,
  onSave,
  onClose,
}) => {
  const [customer, setCustomer] = useState<Customer>(
    existed_customer || defaultCustomer
  );

  const idRef = useRef<IDFieldsRef>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // console.log("customer form change (CustomerForm.tsx):", name, value);
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!("customer_number" in customer)) {
      if (!photoCaptured) {
        alert("Please capture a customer photo before saving.");
        return;
      }
      const ids = idRef.current?.getIDs();
      const isEmpty =
        !ids ||
        ids.length === 0 ||
        ids.every((id) => !id.id_type && !id.id_number);

      if (isEmpty) {
        alert("Please provide valid ID information.");
        return;
      }
      onSave({
        updatedCustomer: customer,
        updatedIDs: ids,
      });
      console.log("customer form submit (CustomerForm.tsx):", customer, ids);
    }
  };

  const handleClose = () => {
    // console.log("customer form close (CustomerForm.tsx):");
    setCameraActive(false);
    setPhotoCaptured(false);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  async function handleCapture(
    fileName: string,
    base64: string
  ): Promise<void> {
    try {
      const relPath = await (window as any).electronAPI.saveCustomerImage(
        fileName,
        base64
      );
      setCustomer((prev) => ({ ...prev, picture_path: relPath }));
      setPhotoCaptured(true);
    } catch (error) {
      setPhotoCaptured(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
                customer_city={customer.city}
                customer_province={customer.province}
                customer_country={customer.country}
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
                {...("customer_number" in customer &&
                typeof customer.customer_number === "number"
                  ? { customerNumber: customer.customer_number as number }
                  : {})}
                onCapture={handleCapture}
                active={cameraActive}
              />
            </Box>
          </Box>
          {/* Bottom panel */}
          <Box>
            <IDFields ref={idRef} />
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button onClick={handleClose} sx={{ mr: 1 }}>
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
