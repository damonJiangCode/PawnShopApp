import { Box, Typography, Avatar, Divider, Chip, Button } from "@mui/material";
import InfoRow from "./InfoRow";
import STAT_COLORS from "../../assets/client/STAT_COLORS";
import { useState } from "react";
import CustomerForm from "./customer_structure/CustomerForm";
import { Customer, ID } from "../../../shared/models/Customer";

const CustomerProfile: React.FC<{ customer: Customer }> = ({ customer }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const identifications: ID[] = customer.identifications || [];

  const handleSaveCustomer = async (customer: Customer) => {
    // TODO handle customer update
  };

  return (
    <Box>
      {/* Stats + Info + Avatar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
          flexWrap: "wrap",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          boxShadow: 1,
        }}
      >
        {/* Stats */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 2.5,
          }}
        >
          <Chip
            label={`Redeem: ${customer.redeem_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.redeem,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Expire: ${customer.expire_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.expire,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Overdue: ${customer.overdue_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.overdue,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
          <Chip
            label={`Theft: ${customer.theft_count}`}
            sx={{
              fontWeight: 700,
              fontSize: 16,
              bgcolor: STAT_COLORS.theft,
              color: "#fff",
              minWidth: 120,
              justifyContent: "center",
            }}
          />
        </Box>

        {/* Basic Info */}
        <Box sx={{ flex: 1, minWidth: 500 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2.5,
              justifyContent: "space-between",
            }}
          >
            {/* Left Column */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <InfoRow
                label="Last Name:"
                value={customer.last_name?.toUpperCase()}
              />
              <InfoRow
                label="First Name:"
                value={customer.first_name?.toUpperCase()}
              />
              <InfoRow
                label="Mid Name:"
                value={customer.middle_name?.toUpperCase()}
              />
              <InfoRow label="Hair Color:" value={customer.hair_color} />
              <InfoRow label="Eye Color:" value={customer.eye_color} />
            </Box>

            {/* Right Column */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <InfoRow label="Customer #:" value={customer.customer_number} />
              <InfoRow label="Gender:" value={customer.gender} />
              <InfoRow label="DoB:" value={customer.date_of_birth} />
              <InfoRow
                label="Height:"
                value={`${customer.height_cm ?? "-"} cm`}
              />
              <InfoRow
                label="Weight:"
                value={`${customer.weight_kg ?? "-"} kg`}
              />
            </Box>
          </Box>
        </Box>

        {/* Avatar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            minWidth: 220,
          }}
        >
          <Avatar
            variant="square"
            src={customer.image_path}
            alt="Customer Photo"
            sx={{
              mb: 1,
              width: 200,
              height: 220,
              borderRadius: 5,
              boxShadow: 8,
            }}
          >
            {!customer.image_path && customer.first_name
              ? customer.first_name[0]
              : ""}
          </Avatar>
          <Button
            sx={{
              width: 140,
              fontSize: 12,
              fontWeight: 700,
              borderRadius: 1,
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
            onClick={() => setShowEditForm(true)}
          >
            EDIT
          </Button>

          {/* Edit Form */}
          {showEditForm && (
            <CustomerForm
              customerExisted={customer}
              open={showEditForm}
              onClose={() => setShowEditForm(false)}
              onSave={handleSaveCustomer}
            />
          )}
        </Box>
      </Box>

      {/* Notes */}
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
          my: 2,
          boxShadow: 1,
        }}
      >
        <Typography>{customer.notes || "No notes available."}</Typography>
      </Box>

      {/* Contact + IDs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {/* Contact */}
        <Box
          sx={{
            flex: 1,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <InfoRow label="Address:" value={customer.address || "-"} />
            <InfoRow label="Postal Code:" value={customer.postal_code || "-"} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <InfoRow label="City:" value={customer.city || "-"} />
            <InfoRow label="Province:" value={customer.province || "-"} />
            <InfoRow label="Country:" value={customer.country || "-"} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <InfoRow label="Phone:" value={customer.phone || "-"} />
            <InfoRow label="Email:" value={customer.email || "-"} />
          </Box>
        </Box>

        {/* Identification */}
        <Box
          sx={{
            flex: 1,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            boxShadow: 1,
          }}
        >
          {identifications.length > 0 ? (
            identifications.map((element, index) => (
              <Box key={index}>
                <InfoRow
                  label={element.id_type + ":"}
                  value={element.id_number || "-"}
                />
              </Box>
            ))
          ) : (
            <Typography>No identifications available.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerProfile;
