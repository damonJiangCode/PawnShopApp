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
import defaultCustomer from "../../../assets/client/defaultCutomer";

interface CustomerFormProps {
  customerExisted?: Customer;
  open: boolean;
  onSave: (customerUpdated: Customer) => void;
  onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = (props) => {
  const { customerExisted, open, onSave, onClose } = props;
  const [customer, setCustomer] = useState<Customer>(
    customerExisted || defaultCustomer
  );
  // console.log(
  //   "Customer form initial state (CustomerForm.tsx):",
  //   JSON.stringify(customer, null, 2)
  // );
  const [identifications, setIdentifications] = useState<ID[]>(
    customerExisted?.identifications ?? customer.identifications ?? []
  );
  // console.log(
  //   "Customer form initial IDs (CustomerForm.tsx):",
  //   JSON.stringify(identifications, null, 2)
  // );
  const idRef = useRef<IDFieldsRef>(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // console.log("Customer form change (CustomerForm.tsx):", name, value);
    setCustomer((prev) => ({ ...prev, [name]: value }));
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
      setCustomer((prev) => ({ ...prev, image_path: relPath }));
      setPhotoCaptured(true);
    } catch (error) {
      setPhotoCaptured(false);
      alert("Failed to save customer image (CustomerForm.tsx).");
      throw error;
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle new customer
    if (!("customer_number" in customer)) {
      if (!photoCaptured) {
        alert("Please capture a customer photo before saving.");
        return;
      }

      const ids = idRef.current?.getIDs();
      const isEmpty =
        !ids ||
        ids.length === 0 ||
        ids.every((id) => !id.id_type || !id.id_value);

      if (isEmpty) {
        alert("Please provide valid ID information.");
        return;
      }
      const customerUpdated = { ...customer, identifications: ids } as Customer;
      try {
        const newCustomer: Customer = await (
          window as any
        ).electronAPI.addCustomer({
          customer: customerUpdated,
          identifications: ids,
        });
        console.log(
          "New customer returned from CustomerCRUD.tsx (CustomerForm.tsx):",
          JSON.stringify(newCustomer, null, 2)
        );
        onSave(newCustomer);
      } catch (err) {
        console.error("Failed to add customer:", err);
        alert("Failed to add customer. Please try again.");
        throw err;
      }
    }
    // TODO handle existing customer update
  };

  const handleClose = () => {
    // console.log("Customer form is closed (CustomerForm.tsx)");
    setCameraActive(false);
    setPhotoCaptured(false);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSave}>
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

            {/* Right panel/ Photo Capture */}
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
                customer={customer}
                onCapture={handleCapture}
                active={cameraActive}
              />
            </Box>
          </Box>
          {/* Bottom panel/ ID Fields */}
          <Box>
            <IDFields ref={idRef} ids={identifications} />
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button type="button" onClick={handleClose} sx={{ mr: 1 }}>
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
