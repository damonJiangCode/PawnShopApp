import { findEmployeeByPassword } from "../db/repositories/employeeRepository.ts";

export const verifyEmployeePassword = async (password: string) => {
  const safePassword = password?.trim() ?? "";

  if (!safePassword) {
    return null;
  }

  return findEmployeeByPassword(safePassword);
};
