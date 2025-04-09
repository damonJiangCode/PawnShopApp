import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

const clientData = {
  clientId: "CL-78945",
  firstName: "Michael",
  lastName: "Johnson",
  middleName: "David",
  gender: "Male",
  dateOfBirth: "1985-07-15",
  street: "123 Maple Avenue",
  city: "Toronto",
  province: "Ontario",
  country: "Canada",
  phoneNumber: "+1 (416) 555-7890",
  age: 39,
  hairColor: "Brown",
  eyeColor: "Blue",
  heightM: 1.85,
  heightFt: "6'1\"",
  weightKg: 82,
  weightLb: 180.8,
  lastPhotoUpdate: "2024-12-10",
  statistics: {
    redeemed: 28,
    expired: 3,
    stolen: 1,
    overdue: {
      current: 5,
      total: 12,
    },
  },
  identifications: [
    { type: "Driver's License", number: "DL-98765432", expiry: "2027-05-20" },
    { type: "Passport", number: "PA-123456789", expiry: "2029-03-15" },
    { type: "Health Card", number: "HC-456789123", expiry: "2026-11-30" },
  ],
};

const ClientComponent: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Column - Photo and Basic Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                src="https://public.readdy.ai/ai/img_res/79080e44e5381caeb2dd4e0cf27216a8.jpg"
                sx={{ width: 120, height: 120, margin: "auto", mb: 2 }}
              />
              <Typography variant="body2" color="textSecondary">
                Last photo update: {clientData.lastPhotoUpdate}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ backgroundColor: "#f5f5f5", mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              {[
                ["Client #", clientData.clientId],
                ["First Name", clientData.firstName],
                ["Last Name", clientData.lastName],
                ["Middle Name", clientData.middleName],
                ["Gender", clientData.gender],
                ["Date of Birth", clientData.dateOfBirth],
                ["Age", clientData.age],
              ].map(([label, value]) => (
                <Box display="flex" justifyContent="space-between" key={label}>
                  <Typography color="textSecondary">{label}:</Typography>
                  <Typography fontWeight="bold">{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        {/* Middle Column - Contact and Physical */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              {[
                ["Phone Number", clientData.phoneNumber],
                ["Street", clientData.street],
                ["City", clientData.city],
                ["Province", clientData.province],
                ["Country", clientData.country],
              ].map(([label, value]) => (
                <Box display="flex" justifyContent="space-between" key={label}>
                  <Typography color="textSecondary">{label}:</Typography>
                  <Typography fontWeight="bold">{value}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        {/* Right Column - Statistics and IDs */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Statistics
              </Typography>
              <Grid container spacing={2}>
                {[
                  ["Redeemed", clientData.statistics.redeemed, "green"],
                  ["Expired", clientData.statistics.expired, "red"],
                  ["Stolen", clientData.statistics.stolen, "orange"],
                  [
                    "Overdue",
                    `${clientData.statistics.overdue.current}/${clientData.statistics.overdue.total}`,
                    "blue",
                  ],
                ].map(([label, value, color]) => (
                  <Grid size={{ xs: 6 }} key={label}>
                    <Box
                      textAlign="center"
                      p={2}
                      borderRadius={2}
                      bgcolor="white"
                      boxShadow={1}
                    >
                      <Typography variant="h4" fontWeight="bold" sx={{ color }}>
                        {value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClientComponent;
