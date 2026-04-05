import { employeeRepo } from "../db/repo/employeeRepo.ts";
import { connect } from "../db/table/createTable.ts";

type DbClient = Awaited<ReturnType<typeof connect>>;

export const employeeBackendService = {
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
    const employee = await employeeBackendService.findByPassword(
      password,
      dbClient,
    );

    return employee?.first_name ?? null;
  },
};
