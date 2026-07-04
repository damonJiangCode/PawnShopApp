import type { Employee } from "../types/Employee.ts";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../types/employeeApiTypes.ts";

export type ElectronEmployeeApi = {
  create: (input: SaveEmployeeInput) => Promise<Employee>;
  search: (input: EmployeeSearchInput) => Promise<Employee[]>;
  update: (
    employeeNumber: number,
    input: SaveEmployeeInput,
  ) => Promise<Employee>;
};
