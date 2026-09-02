type EmployeeDetailsInput = {
  first_name: string;
  last_name: string;
  nickname: string;
  date_of_birth: string;
  gender: string;
  is_terminated: boolean;
  address: string;
  phone: string;
  email: string;
};

export type CreateEmployeeInput = EmployeeDetailsInput & {
  password: string;
};

export type UpdateEmployeeInput = EmployeeDetailsInput & {
  password?: string;
};

export type EmployeeSearchInput = {
  first_name?: string;
  last_name?: string;
};
