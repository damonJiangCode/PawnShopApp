export type SaveEmployeeInput = {
  first_name: string;
  last_name: string;
  nickname: string;
  date_of_birth: string;
  gender: string;
  password: string;
};

export type EmployeeSearchInput = {
  first_name?: string;
  last_name?: string;
};
