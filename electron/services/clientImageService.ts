import { app } from "electron";
import fs from "fs/promises";
import path from "path";

const getBaseDir = () => path.join(app.getPath("userData"), "client-images");

const resolveImagePath = (imagePath: string) => {
  const baseDir = getBaseDir();
  const resolved = path.resolve(baseDir, imagePath);
  if (!resolved.startsWith(baseDir)) {
    throw new Error("Invalid image path");
  }
  return resolved;
};

export const saveClientImage = async (
  fileName: string,
  base64: string
): Promise<string> => {
  if (!base64) {
    throw new Error("Missing image data");
  }
  const baseDir = getBaseDir();
  await fs.mkdir(baseDir, { recursive: true });

  const safeName = path.basename(fileName);
  const relPath = path.join("client-images", safeName);
  const absPath = resolveImagePath(safeName);

  const buffer = Buffer.from(base64, "base64");
  await fs.writeFile(absPath, buffer);

  return relPath;
};

export const getClientImage = async (imagePath: string): Promise<string> => {
  const baseDir = getBaseDir();
  const absPath = path.isAbsolute(imagePath)
    ? imagePath
    : path.resolve(app.getPath("userData"), imagePath);

  if (!absPath.startsWith(baseDir)) {
    throw new Error("Invalid image path");
  }

  const buffer = await fs.readFile(absPath);
  return buffer.toString("base64");
};
