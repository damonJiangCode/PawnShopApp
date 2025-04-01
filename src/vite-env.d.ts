/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    electronAPI: {
      searchName: (name: string) => void;
      searchDatabase: (name: string) => void;
      getUserInfo: (userID: number) => void;
    };
  }
}
