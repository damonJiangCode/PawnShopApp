import { ipcMain } from "electron";

// 处理数据库搜索
async function handleSearchDatabase(_event, name) {
  console.log("Searching database for:", name);
  return `Found ${name} in database!`;
}

// 处理其他 API
async function handleGetUserInfo(_event, userId) {
  console.log("Fetching user info for ID:", userId);
  return { id: userId, name: "Alice", age: 25 };
}

// 统一导出 API 处理函数
export const handlers = {
  "search-database": handleSearchDatabase,
  "get-user-info": handleGetUserInfo,
};
