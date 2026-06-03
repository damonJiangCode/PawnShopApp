import type { Employee } from "../../shared/types/Employee";
import type { SaveEmployeeInput } from "../../shared/types/employeePayload";
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

export const employeeService = {
  createEmployee: async (input: SaveEmployeeInput): Promise<Employee> => {
    const api = getElectronApi()?.employee;

    if (!api) {
      throw new Error("Employee API is unavailable.");
    }

    return api.create(normalizeEmployeeInput(input));
  },
};

export type { Employee, SaveEmployeeInput };
