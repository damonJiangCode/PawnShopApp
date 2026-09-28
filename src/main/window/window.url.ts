import path from "node:path";
import { pathToFileURL } from "node:url";

const { app } = require("electron/main") as typeof import("electron");

type RendererUrlInput = {
  window?: string;
  screen?: string;
  params?: Record<string, string | number | boolean | undefined>;
};
const getRendererBaseUrl = () =>
  app.isPackaged
    ? pathToFileURL(path.join(app.getAppPath(), "dist", "index.html")).toString()
    : "http://localhost:5173";

export const buildRendererUrl = ({
  window,
  screen,
  params = {},
}: RendererUrlInput = {}) => {
  const searchParams = new URLSearchParams();

  if (window) {
    searchParams.set("window", window);
  }

  if (screen) {
    searchParams.set("screen", screen);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const rendererUrl = new URL(getRendererBaseUrl());
  searchParams.forEach((value, key) => rendererUrl.searchParams.set(key, value));
  return rendererUrl.toString();
};
