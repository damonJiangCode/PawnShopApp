import { employeeRepo } from "../repos/employeeRepo.ts";
import type { DbClient } from "../../db/connection.ts";
import type { Employee } from "../../shared/types/Employee.ts";
import type { SaveEmployeeInput } from "../../shared/types/employeePayload.ts";

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
  findByPassword: async (password: string, dbClient?: DbClient) => {
    const safePassword = password?.trim() ?? "";

    if (!safePassword) {
      return null;
    }

    return employeeRepo.findByPassword(safePassword, dbClient);
  },

  getEmployeeDisplayNameByPassword: async (
    password: string,
    dbClient?: DbClient,
  ): Promise<string | null> => {
    const employee = await employeeService.findByPassword(password, dbClient);

    if (!employee) {
      return null;
    }

    return employee.nickname?.trim() || employee.first_name;
  },

  createEmployee: async (input: SaveEmployeeInput): Promise<Employee> => {
    const normalizedInput = normalizeEmployeeInput(input);

    if (!normalizedInput.last_name) {
      throw new Error("Last name is required.");
    }

    if (!normalizedInput.first_name) {
      throw new Error("First name is required.");
    }

    if (!normalizedInput.date_of_birth) {
      throw new Error("Date of birth is required.");
    }

    if (!normalizedInput.gender) {
      throw new Error("Gender is required.");
    }

    if (!normalizedInput.password) {
      throw new Error("Password is required.");
    }

    const existingEmployee = await employeeRepo.findByPassword(
      normalizedInput.password,
    );

    if (existingEmployee) {
      throw new Error("That employee password is already in use.");
    }

    return employeeRepo.create(normalizedInput);
  },
};
