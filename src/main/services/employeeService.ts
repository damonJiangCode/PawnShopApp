import { employeeRepo } from "../repos/employeeRepo.ts";
import type { DbClient } from "../../db/connection.ts";

export const employeeService = {
  findByPassword: async (password: string, dbClient?: DbClient) => {
    const safePassword = password?.trim() ?? "";

    if (!safePassword) {
      return null;
    }

    return employeeRepo.findByPassword(safePassword, dbClient);
  },

  getEmployeeFirstNameByPassword: async (
    password: string,
    dbClient?: DbClient,
  ): Promise<string | null> => {
    const employee = await employeeService.findByPassword(
      password,
      dbClient,
    );

    return employee?.first_name ?? null;
  },
};
