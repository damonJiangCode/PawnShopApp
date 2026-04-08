import type { ElectronApi } from "../../shared/ipc/electronApi";

declare global {
  interface Window {
    electronAPI?: ElectronApi;
  }
}

export const getElectronApi = (): ElectronApi | undefined => {
  return window.electronAPI;
};

export type { ElectronApi } from "../../shared/ipc/electronApi";
