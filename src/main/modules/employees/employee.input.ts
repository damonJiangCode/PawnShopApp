import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../../../shared/types/employeeApiTypes.ts";

const normalizeEmployee = (input: SaveEmployeeInput): SaveEmployeeInput => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
  nickname: input.nickname?.trim() ?? "",
  date_of_birth: input.date_of_birth?.trim() ?? "",
  gender: input.gender?.trim() ?? "",
  password: input.password?.trim() ?? "",
  is_terminated: Boolean(input.is_terminated),
  address: input.address?.trim() ?? "",
  phone: input.phone?.trim() ?? "",
  email: input.email?.trim() ?? "",
});

const normalizeEmployeeSearch = (
  input: EmployeeSearchInput,
): EmployeeSearchInput => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
});

const validateEmployee = (input: SaveEmployeeInput) => {
  if (!input.last_name) {
    throw new Error("Last name is required.");
  }

  if (!input.first_name) {
    throw new Error("First name is required.");
  }

  if (!input.date_of_birth) {
    throw new Error("Date of birth is required.");
  }

  if (!input.gender) {
    throw new Error("Gender is required.");
  }

  if (!input.password) {
    throw new Error("Password is required.");
  }
};

export const employeeInput = {
  normalizeEmployee,
  normalizeEmployeeSearch,
  validateEmployee,
};
