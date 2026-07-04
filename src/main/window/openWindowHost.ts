import { buildRendererUrl } from "./windowUrl.ts";
import { createAppWindow } from "./createAppWindow.ts";

export type OpenWindowHostInput = {
  screen: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  params?: Record<string, string | number | boolean | undefined>;
};

export const openWindowHost = ({
  screen,
  title,
  description,
  width = 720,
  height = 420,
  minWidth = 560,
  minHeight = 320,
  params = {},
}: OpenWindowHostInput): Electron.BrowserWindow => {
  return createAppWindow({
    width,
    height,
    minWidth,
    minHeight,
    title,
    showMenu: false,
    url: buildRendererUrl({
      window: "host",
      screen,
      params: {
        title,
        description,
        ...params,
      },
    }),
    failLogLabel: `${screen} window`,
  });
};
