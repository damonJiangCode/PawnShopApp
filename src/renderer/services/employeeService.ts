import type { Employee } from "../../shared/types/Employee";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../../shared/types/employeeApiTypes";
import { getElectronApi } from "./electronApi";

const normalizeEmployeeInput = (
  input: SaveEmployeeInput,
): SaveEmployeeInput => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
  nickname: input.nickname?.trim() ?? "",
  date_of_birth: input.date_of_birth?.trim() ?? "",
  gender: input.gender?.trim() ?? "",
  password: input.password?.trim() ?? "",
});

const normalizeEmployeeSearchInput = (
  input: EmployeeSearchInput,
): EmployeeSearchInput => ({
  first_name: input.first_name?.trim() ?? "",
  last_name: input.last_name?.trim() ?? "",
});

export const employeeService = {
  createEmployee: async (input: SaveEmployeeInput): Promise<Employee> => {
    const api = getElectronApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.create(normalizeEmployeeInput(input));
  },

  searchEmployees: async (input: EmployeeSearchInput): Promise<Employee[]> => {
    const api = getElectronApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.search(normalizeEmployeeSearchInput(input));
  },

  updateEmployee: async (
    employeeNumber: number,
    input: SaveEmployeeInput,
  ): Promise<Employee> => {
    const api = getElectronApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.update(employeeNumber, normalizeEmployeeInput(input));
  },
};

export type { Employee, EmployeeSearchInput, SaveEmployeeInput };
