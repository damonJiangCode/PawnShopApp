import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem } from "@mui/material";

interface CityProvinceCountryFieldsProps {
  customer_address?: string;
  customer_postal_code?: string;
  customer_city: string;
  customer_province: string;
  customer_country: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CityProvinceCountryFields: React.FC<CityProvinceCountryFieldsProps> = ({
  customer_address,
  customer_postal_code,
  customer_city,
  customer_province,
  customer_country,
  onChange,
}) => {
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState(customer_city);
  const [province, setProvince] = useState(customer_province);
  const [country, setCountry] = useState(customer_country);

  const [provinces, setProvinces] = useState<string[]>([]);
  const [citiesByProvince, setCitiesByProvince] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    const fetchCities = async () => {
      const data = await (window as any).electronAPI.getCities();
      setProvinces(data.provinces);
      setCitiesByProvince(data.citiesByProvince);
      setLoading(false);
    };
    fetchCities();
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    onChange(e);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvince(e.target.value);
    onChange(e);
    const cities = citiesByProvince[e.target.value] || [];
    setCity(cities[0] || "");
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
    onChange(e);
  };

  const availableCities = province ? citiesByProvince[province] || [] : [];

  return (
    <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Address */}
        <TextField
          required
          fullWidth
          name="address"
          label="Address"
          value={customer_address || ""}
          onChange={onChange}
          size="small"
        />
        {/* Postal Code */}
        <TextField
          required
          fullWidth
          name="postal_code"
          label="Postal Code"
          value={customer_postal_code || ""}
          onChange={onChange}
          size="small"
          inputProps={{ maxLength: 6 }}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* City */}
        <TextField
          select
          required
          fullWidth
          name="city"
          label="City"
          value={loading ? "" : city}
          onChange={handleCityChange}
          size="small"
          disabled={!province}
        >
          {availableCities.length === 0 ? (
            <MenuItem disabled>Loading cities...</MenuItem>
          ) : (
            availableCities.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          )}
        </TextField>

        {/* Province */}
        <TextField
          select
          required
          fullWidth
          name="province"
          label="Province"
          value={loading ? "" : province}
          onChange={handleProvinceChange}
          size="small"
          disabled={!country}
        >
          {provinces.length === 0 ? (
            <MenuItem disabled>Loading provinces...</MenuItem>
          ) : (
            provinces.map((prov) => (
              <MenuItem key={prov} value={prov}>
                {prov}
              </MenuItem>
            ))
          )}
        </TextField>

        {/* Country */}
        <TextField
          select
          required
          fullWidth
          name="country"
          label="Country"
          value={loading ? "" : country}
          onChange={handleCountryChange}
          size="small"
        >
          <MenuItem value="Canada">Canada</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
};

export default CityProvinceCountryFields;
