import { employeeRepo } from "./employee.repo.ts";
import type { DbClient } from "../../database/connection.ts";
import type { Employee } from "../../../shared/models/employee.model.ts";
import type {
  CreateEmployeeInput,
  EmployeeSearchInput,
  UpdateEmployeeInput,
} from "../../../shared/payload-contracts/employee.contract.ts";
import { employeeInput } from "./employee.input.ts";

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

  searchEmployees: async (input: EmployeeSearchInput): Promise<Employee[]> => {
    const normalizedInput = employeeInput.normalizeEmployeeSearch(input);

    return employeeRepo.search(normalizedInput);
  },

  createEmployee: async (input: CreateEmployeeInput): Promise<Employee> => {
    const normalizedInput = employeeInput.normalizeCreateEmployee(input);

    employeeInput.validateCreateEmployee(normalizedInput);

    const existingEmployee = await employeeRepo.findByPassword(
      normalizedInput.password,
      undefined,
      true,
    );

    if (existingEmployee) {
      throw new Error("That employee password is already in use.");
    }

    return employeeRepo.create(normalizedInput);
  },

  updateEmployee: async (
    employeeNumber: number,
    input: UpdateEmployeeInput,
  ): Promise<Employee> => {
    if (!Number.isInteger(employeeNumber) || employeeNumber <= 0) {
      throw new Error("Enter a valid employee number.");
    }

    const normalizedInput = employeeInput.normalizeUpdateEmployee(input);
    employeeInput.validateEmployeeDetails(normalizedInput);

    const existingEmployee =
      await employeeRepo.findByEmployeeNumber(employeeNumber);

    if (!existingEmployee) {
      throw new Error("No employee was found for that number.");
    }

    const employeeWithPassword = normalizedInput.password
      ? await employeeRepo.findByPassword(
          normalizedInput.password,
          undefined,
          true,
        )
      : null;

    if (
      employeeWithPassword &&
      employeeWithPassword.employee_number !== employeeNumber
    ) {
      throw new Error("That employee password is already in use.");
    }

    return employeeRepo.update(employeeNumber, normalizedInput);
  },
};
