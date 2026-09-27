import fs from "fs/promises";
import path from "path";
import { randomUUID } from "node:crypto";
import type { ImageKind } from "../../shared/payload-contracts/image.contract.ts";
import { loadEnv } from "../config/env.ts";

const { app } = require("electron/main") as typeof import("electron");

loadEnv();

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const getWorkspaceImageBaseDir = () => {
  return path.resolve(
    process.env.IMAGE_ROOT?.trim() || path.join(process.cwd(), "images"),
  );
};

const getClientImageBaseDir = () => {
  return path.join(getWorkspaceImageBaseDir(), "clients");
};

const getItemImageBaseDir = () => {
  return path.join(getWorkspaceImageBaseDir(), "items");
};

const getMigrationImageBaseDir = (kind: ImageKind) => {
  return path.join(
    process.cwd(),
    "migration-data",
    "exports",
    kind === "client" ? "client-photos" : "item-photos",
  );
};

const getStagingImageBaseDir = (kind: ImageKind) =>
  path.join(
    getWorkspaceImageBaseDir(),
    ".staging",
    kind === "client" ? "clients" : "items",
  );

const resolveImagePath = (baseDir: string, imagePath: string) => {
  const resolved = path.resolve(baseDir, imagePath);

  if (!resolved.startsWith(`${baseDir}${path.sep}`) && resolved !== baseDir) {
    throw new Error("Invalid image path");
  }

  return resolved;
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

const isPathInside = (baseDir: string, filePath: string) => {
  const relativePath = path.relative(
    path.resolve(baseDir),
    path.resolve(filePath),
  );
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
};

const resolveStoredImagePath = async (
  imagePath: string,
  baseDir: string,
): Promise<string> => {
  if (path.isAbsolute(imagePath)) {
    return imagePath;
  }

  const normalizedImagePath = imagePath.replaceAll("\\", "/");
  const imageRoot = getWorkspaceImageBaseDir();

  if (normalizedImagePath.startsWith(".staging/")) {
    return resolveImagePath(imageRoot, normalizedImagePath);
  }

  if (normalizedImagePath.startsWith("images/")) {
    return resolveImagePath(imageRoot, normalizedImagePath.slice(7));
  }

  const workspacePath = path.resolve(process.cwd(), imagePath);
  const workspaceBase = path.resolve(process.cwd());

  if (
    workspacePath.startsWith(`${workspaceBase}${path.sep}`) &&
    (await fileExists(workspacePath))
  ) {
    return workspacePath;
  }

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
  const extension = path.extname(currentBaseName) || ".png";
  const nextName = `${prefix}_${randomUUID()}${extension}`;
  const nextPath = path.join(baseDir, nextName);
  const nextRelPath = path.join("images", path.basename(baseDir), nextName);

  if (!(await fileExists(currentPath))) {
    return imagePath;
  }

  await fs.copyFile(currentPath, nextPath);
  return nextRelPath;
};

const saveStagedImage = async (
  kind: ImageKind,
  fileName: string,
  base64: string,
) => {
  if (!base64) {
    throw new Error("Missing image data");
  }

  const estimatedBytes = Math.floor((base64.length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large. Select an image smaller than 15 MB.");
  }

  const stagingDir = getStagingImageBaseDir(kind);
  await fs.mkdir(stagingDir, { recursive: true });

  const originalExtension = path.extname(path.basename(fileName)).toLowerCase();
  const extension = [".png", ".jpg", ".jpeg", ".webp"].includes(
    originalExtension,
  )
    ? originalExtension
    : ".png";
  const stagedName = `${randomUUID()}${extension}`;
  const stagedPath = path.join(stagingDir, stagedName);

  await fs.writeFile(stagedPath, Buffer.from(base64, "base64"));
  return path.join(
    ".staging",
    kind === "client" ? "clients" : "items",
    stagedName,
  );
};

export const imageStorage = {
  saveClientImage: async (
    fileName: string,
    base64: string,
  ): Promise<string> => {
    return saveStagedImage("client", fileName, base64);
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
    return saveStagedImage("item", fileName, base64);
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

  resolveImageFile: async (
    kind: ImageKind,
    imagePath: string,
  ): Promise<string | null> => {
    const baseDir =
      kind === "client" ? getClientImageBaseDir() : getItemImageBaseDir();
    const filePath = await resolveStoredImagePath(imagePath, baseDir);
    const allowedBaseDirs = [
      baseDir,
      getStagingImageBaseDir(kind),
      getMigrationImageBaseDir(kind),
      app.getPath("userData"),
    ];

    if (
      !allowedBaseDirs.some((allowedDir) => isPathInside(allowedDir, filePath))
    ) {
      return null;
    }

    return (await fileExists(filePath)) ? filePath : null;
  },

  cleanupStaging: async (
    referencedImagePaths: Set<string>,
    olderThanMs = 24 * 60 * 60 * 1000,
  ): Promise<number> => {
    const normalizedReferences = new Set(
      [...referencedImagePaths].map((value) => value.replaceAll("\\", "/")),
    );
    let removedCount = 0;

    for (const kind of ["client", "item"] as const) {
      const stagingDir = getStagingImageBaseDir(kind);
      let entries: import("node:fs").Dirent<string>[];

      try {
        entries = await fs.readdir(stagingDir, { withFileTypes: true });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
          continue;
        }
        throw error;
      }

      for (const entry of entries) {
        if (!entry.isFile()) {
          continue;
        }

        const relativePath = path
          .join(".staging", kind === "client" ? "clients" : "items", entry.name)
          .replaceAll("\\", "/");

        if (normalizedReferences.has(relativePath)) {
          continue;
        }

        const absolutePath = path.join(stagingDir, entry.name);
        const stats = await fs.stat(absolutePath);

        if (Date.now() - stats.mtimeMs < olderThanMs) {
          continue;
        }

        await fs.unlink(absolutePath);
        removedCount += 1;
      }
    }

    return removedCount;
  },

  removeStagedImage: async (imagePath: string): Promise<void> => {
    const normalizedPath = imagePath.replaceAll("\\", "/");

    if (!normalizedPath.startsWith(".staging/")) {
      return;
    }

    const absolutePath = resolveImagePath(
      getWorkspaceImageBaseDir(),
      normalizedPath,
    );

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  },

  removeFinalizedImage: async (
    kind: ImageKind,
    imagePath: string,
  ): Promise<void> => {
    const baseDir =
      kind === "client" ? getClientImageBaseDir() : getItemImageBaseDir();
    const absolutePath = await resolveStoredImagePath(imagePath, baseDir);

    if (!isPathInside(baseDir, absolutePath)) {
      return;
    }

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  },
};
