import { Box, Typography, Avatar, Divider, Chip, Button } from "@mui/material";
import InfoRow from "./InfoRow";
import STAT_COLORS from "../../assets/client/STAT_COLORS";
import { useState } from "react";
import CustomerForm from "./customerForm/CustomerForm";
import { Customer, ID } from "../../../shared/models/Customer";

const CustomerProfile = ({ customer }: { customer: any }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  // TODO: fetch IDs from backend
  const handleEditCustomer = async ({
    updatedCustomer,
    updatedIDs,
  }: {
    updatedCustomer: Customer;
    updatedIDs: ID[];
  }) => {
    try {
      const newCustomer: Customer = await (
        window as any
      ).electronAPI.addCustomer({
        customer: updatedCustomer,
        identifications: updatedIDs,
      });

      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to add customer or identifications:", err);
      alert("Failed to add customer. Please try again.");
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      {/* Top: Avatar + Basic info + Stats */}
      <Typography variant="h5" gutterBottom>
        ACCOUNT INFO
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          m: 1,
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 300,
            height: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
            justifyContent: "center",
          }}
        >
          <Avatar
            variant="square"
            src={customer.picture_path}
            alt="Customer Photo"
            sx={{
              m: 2,
              width: 200,
              height: 220,
              bgcolor: "#eee",
              fontSize: 64,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            {!customer.picture_path && customer.first_name
              ? customer.first_name[0]
              : ""}
          </Avatar>
          <Button
            style={{
              fontSize: 12,
              borderRadius: 4,
              border: "none",
              backgroundColor: "#1976d2",
              color: "#fff",
            }}
            onClick={() => setShowAddForm(true)}
          >
            EDIT
          </Button>

          {showAddForm && (
            <CustomerForm
              open={showAddForm}
              onClose={() => setShowAddForm(false)}
              onSave={handleEditCustomer}
            />
          )}
        </Box>
        {/* Basic info */}
        <Box>
          <Box sx={{ display: "flex", gap: 6 }}>
            {/* left column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <InfoRow
                label="Last Name:"
                value={(customer.last_name || "-").toUpperCase()}
              />
              <InfoRow
                label="First Name:"
                value={(customer.first_name || "-").toUpperCase()}
              />
              <InfoRow
                label="Middle Name:"
                value={(customer.middle_name || "-").toUpperCase()}
              />
              <InfoRow label="Hair Color:" value={customer.hair_color || "-"} />
              <InfoRow label="Eye Color:" value={customer.eye_color || "-"} />
            </Box>
            {/* right column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <InfoRow
                label="Customer #:"
                value={customer.customer_number || "-"}
              />
              <InfoRow label="Gender:" value={customer.gender || "-"} />
              <InfoRow
                label="Date of Birth:"
                value={customer.date_of_birth || "-"}
              />
              <InfoRow
                label="Height:"
                value={`${customer.height_cm}cm` || "-"}
              />
              <InfoRow
                label="Weight:"
                value={`${customer.weight_kg}kg` || "-"}
              />
            </Box>
          </Box>
        </Box>
        {/* Stats */}
        <Box
          sx={{
            minWidth: 240,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Chip
            label={`Redeem: ${customer.redeem_count}`}
            color="success"
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.redeem,
              color: "#fff",
              minWidth: 100,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Expire: ${customer.expire_count}`}
            color="warning"
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.expire,
              color: "#fff",
              minWidth: 100,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Overdue: ${customer.overdue_count}`}
            color="error"
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.overdue,
              color: "#fff",
              minWidth: 100,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Theft: ${customer.theft_count}`}
            color="secondary"
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.theft,
              color: "#fff",
              minWidth: 100,
              justifyContent: "center",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Notes */}
      <Typography variant="h5" gutterBottom>
        NOTES
      </Typography>
      <Typography>{customer.notes || "No notes available."}</Typography>

      <Divider sx={{ my: 2 }} />

      {/* Contact */}
      <Typography variant="h5" gutterBottom>
        CONTACT
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          m: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <InfoRow label="Phone:" value={customer.phone || "-"} />
          <InfoRow label="Email:" value={customer.email || "-"} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <InfoRow label="Address:" value={customer.address || "-"} />
          <InfoRow label="Postal Code:" value={customer.postal_code || "-"} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <InfoRow label="City:" value={customer.city || "-"} />
          <InfoRow label="Province:" value={customer.province || "-"} />
          <InfoRow label="Country:" value={customer.country || "-"} />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerProfile;
