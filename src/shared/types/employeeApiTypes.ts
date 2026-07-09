export type SaveEmployeeInput = {
  first_name: string;
  last_name: string;
  nickname: string;
  date_of_birth: string;
  gender: string;
  password: string;
  is_terminated: boolean;
  address: string;
  phone: string;
  email: string;
};

export type EmployeeSearchInput = {
  first_name?: string;
  last_name?: string;
};
