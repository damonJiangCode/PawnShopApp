import { Pool, type PoolClient } from "pg";
import { loadEnv } from "../config/env.ts";

loadEnv();

const requireSetting = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required database setting: ${name}`);
  }

  return value;
};

const readPositiveInteger = (name: string, fallback: number) => {
  const value = Number(process.env[name] ?? fallback);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a valid positive integer.`);
  }

  return value;
};

const databasePort = readPositiveInteger("DB_PORT", 5432);
const queryTimeoutMs = readPositiveInteger("DB_QUERY_TIMEOUT_MS", 30_000);
const connectionTimeoutMs = readPositiveInteger(
  "DB_CONNECTION_TIMEOUT_MS",
  5_000,
);
const poolMax = readPositiveInteger("DB_POOL_MAX", 12);
const appTimeZone = process.env.APP_TIME_ZONE?.trim() || "America/Regina";

if (!/^[A-Za-z0-9_+\-/]+$/.test(appTimeZone)) {
  throw new Error("APP_TIME_ZONE contains unsupported characters.");
}

const pool = new Pool({
  user: requireSetting("DB_USER"),
  host: requireSetting("DB_HOST"),
  database: requireSetting("DB_NAME"),
  password: requireSetting("DB_PASSWORD"),
  port: databasePort,
  connectionTimeoutMillis: connectionTimeoutMs,
  idleTimeoutMillis: 30_000,
  max: poolMax,
  options: `-c timezone=${appTimeZone} -c statement_timeout=${queryTimeoutMs} -c idle_in_transaction_session_timeout=${queryTimeoutMs}`,
});

pool.on("error", (error) => {
  console.error("[database] An idle database connection failed:", error);
});

export type DbClient = PoolClient;

export const connect = async (): Promise<DbClient> => {
  return pool.connect();
};

export const getDatabaseNow = async (client: DbClient): Promise<Date> => {
  const result = await client.query<{ current_datetime: Date }>(
    "SELECT CURRENT_TIMESTAMP AS current_datetime",
  );
  return new Date(result.rows[0].current_datetime);
};

export const getDatabaseDateKey = async (client: DbClient): Promise<string> => {
  const result = await client.query<{ current_date_key: string }>(
    "SELECT TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD') AS current_date_key",
  );
  return result.rows[0].current_date_key;
};

export const closeDatabase = async () => {
  await pool.end();
};
