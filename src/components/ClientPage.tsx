import React from "react";
import Grid from "@mui/material/Grid";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import type { Customer } from "../../models/customer";
import CardTitle from "./CardTitle";

const ClientPage: React.FC<{ customer: Customer | null }> = ({ customer }) => {
  if (!customer) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          Please select a customer from the left.
        </Typography>
      </Container>
    );
  }

  return (
    <Grid container spacing={2}>
      {/* Left Column - Photo and Basic Info */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ backgroundColor: "#f5f5f5" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Avatar
              src="https://public.readdy.ai/ai/img_res/79080e44e5381caeb2dd4e0cf27216a8.jpg"
              sx={{ width: 120, height: 120, margin: "auto", mb: 2 }}
            />
            <Typography variant="body2" color="textSecondary">
              Last photo update: {customer.lastPhotoUpdate}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: "#f5f5f5", mt: 2 }}>
          <CardContent>
            <CardTitle title="Basic Information" />
            {[
              ["Client #", customer.clientId],
              ["First Name", customer.firstName],
              ["Last Name", customer.lastName],
              ["Middle Name", customer.middleName],
              ["Gender", customer.gender],
              ["Date of Birth", customer.dateOfBirth],
              ["Age", customer.age],
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
            <CardTitle title="Contact Information" />
            {[
              ["Phone Number", customer.phoneNumber],
              ["Street", customer.street],
              ["City", customer.city],
              ["Province", customer.province],
              ["Country", customer.country],
            ].map(([label, value]) => (
              <Box display="flex" justifyContent="space-between" key={label}>
                <Typography color="textSecondary">{label}:</Typography>
                <Typography fontWeight="bold">{value}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: "#f5f5f5", mt: 2 }}>
          <CardContent>
            <CardTitle title="Physical Characteristics" />
            {[
              ["Hair Color", customer.hairColor],
              ["Eye Color", customer.eyeColor],
              ["Height (m)", customer.heightM],
              ["Height (ft)", customer.heightFt],
              ["Weight (kg)", customer.weightKg],
              ["Weight (lb)", customer.weightLb],
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
            <CardTitle title="Transaction Statistics" />
            <Grid container spacing={2}>
              {[
                ["Redeemed", customer.statistics.redeemed, "green"],
                ["Expired", customer.statistics.expired, "red"],
                ["Stolen", customer.statistics.stolen, "orange"],
                [
                  "Overdue",
                  `${customer.statistics.overdue.current}/${customer.statistics.overdue.total}`,
                  "blue",
                ],
              ].map(([label, value, color]) => (
                <Grid size={6} key={label}>
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
        <Card sx={{ backgroundColor: "#f5f5f5", mt: 2 }}>
          <CardContent>
            <CardTitle title="Identifications" />
            <List dense>
              {customer.identifications.map((id, idx) => (
                <React.Fragment key={idx}>
                  <ListItem>
                    <ListItemText
                      primary={id.type}
                      secondary={<span>Number: {id.number}</span>}
                    />
                  </ListItem>
                  {idx < customer.identifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClientPage;
