import type { ElectronApi } from "../../shared/ipc/contracts";

declare global {
  interface Window {
    electronAPI?: ElectronApi;
  }
}

export const getElectronApi = (): ElectronApi | undefined => {
  return window.electronAPI;
};

export type { ElectronApi } from "../../shared/ipc/contracts";
