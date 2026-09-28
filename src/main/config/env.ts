import fs from "fs";
import path from "path";

let isLoaded = false;

const resolveEnvPath = () => {
  const explicitPath = process.env.PAWNSYSTEM_ENV_FILE?.trim();
  if (explicitPath) {
    return path.resolve(explicitPath);
  }

  if (!process.versions.electron || process.defaultApp) {
    return path.resolve(process.cwd(), ".env");
  }

  const appData = process.env.APPDATA?.trim();
  if (!appData) {
    throw new Error("APPDATA is required to locate the PawnSystem configuration.");
  }

  return path.join(appData, "PawnSystem", "app.env");
};

export const loadEnv = () => {
  if (isLoaded) {
    return;
  }

  isLoaded = true;
  const envPath = resolveEnvPath();

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalIndex = line.indexOf("=");
    if (equalIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalIndex).trim();
    const value = line.slice(equalIndex + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};
