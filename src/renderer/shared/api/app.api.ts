import type { AppApi } from "../../../shared/api/appApi";

declare global {
  interface Window {
    appAPI?: AppApi;
  }
}

export const getAppApi = (): AppApi | undefined => {
  return window.appAPI;
};
