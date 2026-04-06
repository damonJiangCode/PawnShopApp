import fs from "fs/promises";
import path from "path";

const { app } = require("electron/main") as typeof import("electron");

const getClientImageBaseDir = () => {
  return path.join(app.getPath("userData"), "client-images");
};

const resolveClientImagePath = (imagePath: string) => {
  const baseDir = getClientImageBaseDir();
  const resolved = path.resolve(baseDir, imagePath);

  if (!resolved.startsWith(baseDir)) {
    throw new Error("Invalid image path");
  }

  return resolved;
};

export const imageStorage = {
  saveClientImage: async (fileName: string, base64: string): Promise<string> => {
    if (!base64) {
      throw new Error("Missing image data");
    }

    const baseDir = getClientImageBaseDir();
    await fs.mkdir(baseDir, { recursive: true });

    const safeName = path.basename(fileName);
    const relPath = path.join("client-images", safeName);
    const absPath = resolveClientImagePath(safeName);
    const buffer = Buffer.from(base64, "base64");

    await fs.writeFile(absPath, buffer);
    return relPath;
  },

  loadClientImage: async (imagePath: string): Promise<string> => {
    const baseDir = getClientImageBaseDir();
    const absPath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(app.getPath("userData"), imagePath);

    if (!absPath.startsWith(baseDir)) {
      throw new Error("Invalid image path");
    }

    const buffer = await fs.readFile(absPath);
    return buffer.toString("base64");
  },
};
