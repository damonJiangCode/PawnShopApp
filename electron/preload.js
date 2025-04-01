const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  searchDatabase: (name) => ipcRenderer.invoke("search-database", name),
  getUserInfo: (userId) => ipcRenderer.invoke("get-user-info", userId),
});
