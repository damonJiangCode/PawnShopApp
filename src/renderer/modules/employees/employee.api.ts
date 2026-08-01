import type { Employee } from "../../../shared/models/employee.model";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../../../shared/payload-contracts/employee.contract";
import { getAppApi } from "../../shared/api/app.api";

const normalizeEmployeeInput = (
  input: SaveEmployeeInput,
): SaveEmployeeInput => ({
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

const normalizeEmployeeSearchInput = (
  input: EmployeeSearchInput,
): EmployeeSearchInput => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
});

export const employeeService = {
  createEmployee: async (input: SaveEmployeeInput): Promise<Employee> => {
    const api = getAppApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.createEmployee(normalizeEmployeeInput(input));
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
    input: SaveEmployeeInput,
  ): Promise<Employee> => {
    const api = getAppApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.updateEmployee(employeeNumber, normalizeEmployeeInput(input));
  },
};

export type { Employee, EmployeeSearchInput, SaveEmployeeInput };
