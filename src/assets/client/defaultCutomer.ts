import { Customer } from "../../../shared/models/Customer";

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
  image_path: "",
  updated_at: new Date(),
  identifications: [
    { id_type: "", id_number: "" },
    { id_type: "", id_number: "" },
  ],
  redeem_count: 0,
  expire_count: 0,
  overdue_count: 0,
  theft_count: 0,
};

export default defaultCustomer;
