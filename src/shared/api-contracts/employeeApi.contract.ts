import type { Employee } from "../models/employee.model.ts";
import type {
  CreateEmployeeInput,
  EmployeeSearchInput,
  UpdateEmployeeInput,
} from "../payload-contracts/employee.contract.ts";

export type EmployeeApi = {
  createEmployee: (input: CreateEmployeeInput) => Promise<Employee>;
  searchEmployees: (input: EmployeeSearchInput) => Promise<Employee[]>;
  updateEmployee: (
    employeeNumber: number,
    input: UpdateEmployeeInput,
  ) => Promise<Employee>;
};
