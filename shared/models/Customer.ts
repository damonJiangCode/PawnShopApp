export interface ID {
  customer_number?: number;
  id_type: string;
  id_number: string;
}

export interface Customer {
  customer_number?: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  date_of_birth: Date;
  gender: string;
  hair_color: string;
  eye_color: string;
  height_cm: number | undefined;
  weight_kg: number | undefined;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  country: string;
  email: string;
  phone: string;
  notes: string;
  picture_path: string;
  updated_at: Date;
}
