import type { Employee } from "../types/Employee.ts";
import type { SaveEmployeeInput } from "../types/employeePayload.ts";

export type ElectronEmployeeApi = {
  create: (payload: SaveEmployeeInput) => Promise<Employee>;
};
