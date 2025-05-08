export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  heightCm?: number;
  heightFt?: number;
  weightKg?: number;
  weightLb?: number;
  notes?: string;
  pictureUrl?: string;
}

export interface Identification {
  idType: string;
  idNumber: string;
}
