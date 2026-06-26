import fs from "fs/promises";
import path from "path";

const { app } = require("electron/main") as typeof import("electron");

const getWorkspaceImageBaseDir = () => {
  return path.join(process.cwd(), "images");
};

const getClientImageBaseDir = () => {
  return path.join(getWorkspaceImageBaseDir(), "clients");
};

const getItemImageBaseDir = () => {
  return path.join(getWorkspaceImageBaseDir(), "items");
};

const resolveImagePath = (baseDir: string, imagePath: string) => {
  const resolved = path.resolve(baseDir, imagePath);

  if (!resolved.startsWith(`${baseDir}${path.sep}`) && resolved !== baseDir) {
    throw new Error("Invalid image path");
  }

  return resolved;
};

const resolveClientImagePath = (imagePath: string) => {
  return resolveImagePath(getClientImageBaseDir(), imagePath);
};

const resolveItemImagePath = (imagePath: string) => {
  return resolveImagePath(getItemImageBaseDir(), imagePath);
};

const getLegacyImagePath = (imagePath: string): string | null => {
  const legacyPath = path.resolve(app.getPath("userData"), imagePath);
  const legacyBase = path.resolve(app.getPath("userData"));

  if (!legacyPath.startsWith(`${legacyBase}${path.sep}`)) {
    return null;
  }

  return legacyPath;
};

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const resolveStoredImagePath = async (
  imagePath: string,
  baseDir: string,
): Promise<string> => {
  if (path.isAbsolute(imagePath)) {
    return imagePath;
  }

  const workspacePath = path.resolve(process.cwd(), imagePath);

  if (workspacePath.startsWith(`${baseDir}${path.sep}`)) {
    return workspacePath;
  }

  const directPath = path.resolve(baseDir, path.basename(imagePath));

  if (await fileExists(directPath)) {
    return directPath;
  }

  const legacyPath = getLegacyImagePath(imagePath);
  return legacyPath ?? directPath;
};

const finalizeImage = async (
  imagePath: string,
  baseDir: string,
  prefix: string,
): Promise<string> => {
  if (!imagePath) {
    return "";
  }

  const currentBaseName = path.basename(imagePath);

  if (currentBaseName.startsWith(`${prefix}_`)) {
    return imagePath;
  }

  await fs.mkdir(baseDir, { recursive: true });

  const currentPath = await resolveStoredImagePath(imagePath, baseDir);
  const nextName = `${prefix}_${Date.now()}.png`;
  const nextPath = path.join(baseDir, nextName);
  const nextRelPath = path.join("images", path.basename(baseDir), nextName);

  if (!(await fileExists(currentPath))) {
    return imagePath;
  }

  await fs.rename(currentPath, nextPath);
  return nextRelPath;
};

export const imageStorage = {
  saveClientImage: async (fileName: string, base64: string): Promise<string> => {
    if (!base64) {
      throw new Error("Missing image data");
    }

    const baseDir = getClientImageBaseDir();
    await fs.mkdir(baseDir, { recursive: true });

    const safeName = path.basename(fileName);
    const relPath = path.join("images", "clients", safeName);
    const absPath = resolveClientImagePath(safeName);
    const buffer = Buffer.from(base64, "base64");

    await fs.writeFile(absPath, buffer);
    return relPath;
  },

  loadClientImage: async (imagePath: string): Promise<string> => {
    const baseDir = getClientImageBaseDir();
    const absPath = await resolveStoredImagePath(imagePath, baseDir);

    if (!(await fileExists(absPath))) {
      return "";
    }

    const buffer = await fs.readFile(absPath);
    return buffer.toString("base64");
  },

  finalizeClientImage: async (
    clientNumber: number,
    imagePath: string,
  ): Promise<string> => {
    return finalizeImage(
      imagePath,
      getClientImageBaseDir(),
      `client_${clientNumber}`,
    );
  },

  saveItemImage: async (fileName: string, base64: string): Promise<string> => {
    if (!base64) {
      throw new Error("Missing image data");
    }

    const baseDir = getItemImageBaseDir();
    await fs.mkdir(baseDir, { recursive: true });

    const safeName = path.basename(fileName);
    const relPath = path.join("images", "items", safeName);
    const absPath = resolveItemImagePath(safeName);
    const buffer = Buffer.from(base64, "base64");

    await fs.writeFile(absPath, buffer);
    return relPath;
  },

  loadItemImage: async (imagePath: string): Promise<string> => {
    const baseDir = getItemImageBaseDir();
    const absPath = await resolveStoredImagePath(imagePath, baseDir);

    if (!(await fileExists(absPath))) {
      return "";
    }

    const buffer = await fs.readFile(absPath);
    return buffer.toString("base64");
  },

  finalizeItemImage: async (
    itemNumber: number,
    imagePath: string,
  ): Promise<string> => {
    return finalizeImage(
      imagePath,
      getItemImageBaseDir(),
      `item_${itemNumber}`,
    );
  },
};
