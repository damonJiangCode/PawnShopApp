export interface Identification {
  id_type: string | undefined;
  id_number: string | undefined;
}

export interface Customer {
  customer_number: number;
  first_name: string | undefined;
  last_name: string | undefined;
  middle_name?: string | undefined;
  date_of_birth?: Date | undefined;
  gender?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  province?: string | undefined;
  country?: string | undefined;
  postal_code?: string | undefined;
  height_cm?: number | undefined;
  height_ft?: number | undefined;
  weight_kg?: number | undefined;
  weight_lb?: number | undefined;
  notes?: string | undefined;
  picture_url?: string | undefined;
  updated_at?: Date | undefined;
  identifications?: Identification[];
}
