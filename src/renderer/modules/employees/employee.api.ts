import type { Employee } from "../../../shared/models/employee.model";
import type {
  CreateEmployeeInput,
  EmployeeSearchInput,
  UpdateEmployeeInput,
} from "../../../shared/payload-contracts/employee.contract";
import { getAppApi } from "../../shared/api/app.api";

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

const normalizeCreateEmployeeInput = (
  input: CreateEmployeeInput,
): CreateEmployeeInput => ({
  ...normalizeEmployeeDetails(input),
  password: input.password?.trim() ?? "",
});

const normalizeUpdateEmployeeInput = (
  input: UpdateEmployeeInput,
): UpdateEmployeeInput => ({
  ...normalizeEmployeeDetails(input),
  password: input.password?.trim() || undefined,
});

const normalizeEmployeeSearchInput = (
  input: EmployeeSearchInput,
): EmployeeSearchInput => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
});

export const employeeApi = {
  createEmployee: async (input: CreateEmployeeInput): Promise<Employee> => {
    const api = getAppApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.createEmployee(normalizeCreateEmployeeInput(input));
  },

  searchEmployees: async (input: EmployeeSearchInput): Promise<Employee[]> => {
    const api = getAppApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.searchEmployees(normalizeEmployeeSearchInput(input));
  },

  updateEmployee: async (
    employeeNumber: number,
    input: UpdateEmployeeInput,
  ): Promise<Employee> => {
    const api = getAppApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.updateEmployee(
      employeeNumber,
      normalizeUpdateEmployeeInput(input),
    );
  },
};

export type {
  CreateEmployeeInput,
  Employee,
  EmployeeSearchInput,
  UpdateEmployeeInput,
};
