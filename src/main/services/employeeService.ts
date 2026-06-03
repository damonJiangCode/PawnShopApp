import { employeeRepo } from "../repos/employeeRepo.ts";
import type { DbClient } from "../../db/connection.ts";
import type { Employee } from "../../shared/types/Employee.ts";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../../shared/types/employeePayload.ts";

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

const validateEmployeeInput = (input: SaveEmployeeInput) => {
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
    const normalizedInput = normalizeEmployeeSearchInput(input);

    return employeeRepo.search(normalizedInput);
  },

  createEmployee: async (input: SaveEmployeeInput): Promise<Employee> => {
    const normalizedInput = normalizeEmployeeInput(input);

    validateEmployeeInput(normalizedInput);

    const existingEmployee = await employeeRepo.findByPassword(
      normalizedInput.password,
    );

    if (existingEmployee) {
      throw new Error("That employee password is already in use.");
    }

    return employeeRepo.create(normalizedInput);
  },

  updateEmployee: async (
    employeeNumber: number,
    input: SaveEmployeeInput,
  ): Promise<Employee> => {
    if (!Number.isInteger(employeeNumber) || employeeNumber <= 0) {
      throw new Error("Enter a valid employee number.");
    }

    const normalizedInput = normalizeEmployeeInput(input);
    validateEmployeeInput(normalizedInput);

    const existingEmployee =
      await employeeRepo.findByEmployeeNumber(employeeNumber);

    if (!existingEmployee) {
      throw new Error("No employee was found for that number.");
    }

    const employeeWithPassword = await employeeRepo.findByPassword(
      normalizedInput.password,
    );

    if (
      employeeWithPassword &&
      employeeWithPassword.employee_number !== employeeNumber
    ) {
      throw new Error("That employee password is already in use.");
    }

    return employeeRepo.update(employeeNumber, normalizedInput);
  },
};
