import type { Employee } from "../models/employee.model.ts";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../payload-contracts/employee.contract.ts";

export type EmployeeApi = {
  createEmployee: (input: SaveEmployeeInput) => Promise<Employee>;
  searchEmployees: (input: EmployeeSearchInput) => Promise<Employee[]>;
  updateEmployee: (
    employeeNumber: number,
    input: SaveEmployeeInput,
  ) => Promise<Employee>;
};
