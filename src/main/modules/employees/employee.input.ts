import type {
  CreateEmployeeInput,
  EmployeeSearchInput,
  UpdateEmployeeInput,
} from "../../../shared/payload-contracts/employee.contract.ts";

const normalizeEmployeeDetails = (
  input: CreateEmployeeInput | UpdateEmployeeInput,
) => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
  nickname: input.nickname?.trim() ?? "",
  date_of_birth: input.date_of_birth?.trim() ?? "",
  gender: input.gender?.trim() ?? "",
  is_terminated: Boolean(input.is_terminated),
  address: input.address?.trim() ?? "",
  phone: input.phone?.trim() ?? "",
  email: input.email?.trim() ?? "",
});

const normalizeCreateEmployee = (
  input: CreateEmployeeInput,
): CreateEmployeeInput => ({
  ...normalizeEmployeeDetails(input),
  password: input.password?.trim() ?? "",
});

const normalizeUpdateEmployee = (
  input: UpdateEmployeeInput,
): UpdateEmployeeInput => ({
  ...normalizeEmployeeDetails(input),
  password: input.password?.trim() || undefined,
});

const normalizeEmployeeSearch = (
  input: EmployeeSearchInput,
): EmployeeSearchInput => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
});

const validateEmployeeDetails = (
  input: CreateEmployeeInput | UpdateEmployeeInput,
) => {
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
};

const validateCreateEmployee = (input: CreateEmployeeInput) => {
  validateEmployeeDetails(input);

  if (!input.password) {
    throw new Error("Password is required.");
  }
};

export const employeeInput = {
  normalizeCreateEmployee,
  normalizeUpdateEmployee,
  normalizeEmployeeSearch,
  validateEmployeeDetails,
  validateCreateEmployee,
};
