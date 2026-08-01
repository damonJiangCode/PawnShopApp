import type { AppApi } from "../../../shared/api-contracts/appApi.contract";

declare global {
  interface Window {
    appAPI?: AppApi;
  }
}

export const getAppApi = (): AppApi | undefined => {
  return window.appAPI;
};
