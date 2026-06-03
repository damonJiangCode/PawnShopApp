import type { Employee } from "../types/Employee.ts";
import type {
  EmployeeSearchInput,
  SaveEmployeeInput,
} from "../types/employeePayload.ts";

export type ElectronEmployeeApi = {
  create: (payload: SaveEmployeeInput) => Promise<Employee>;
  search: (payload: EmployeeSearchInput) => Promise<Employee[]>;
  update: (
    employeeNumber: number,
    payload: SaveEmployeeInput,
  ) => Promise<Employee>;
};
