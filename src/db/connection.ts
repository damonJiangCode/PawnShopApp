import { Pool, type PoolClient } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnvFile = () => {
  const envPath = path.resolve(__dirname, "../../.env");
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

loadEnvFile();

const pool = new Pool({
  user: process.env.DB_USER ?? "damon",
  host: process.env.DB_HOST ?? "localhost",
  database: process.env.DB_NAME ?? "PawnShopDB",
  password: process.env.DB_PASSWORD ?? "0236",
  port: Number(process.env.DB_PORT ?? 5432),
});

export type DbClient = PoolClient;

export const connect = async (): Promise<DbClient> => {
  return pool.connect();
};
