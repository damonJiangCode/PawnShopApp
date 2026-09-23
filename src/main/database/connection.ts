import { Pool, type PoolClient } from "pg";
import { loadEnv } from "../config/env.ts";

loadEnv();

const pool = new Pool({
  user: process.env.DB_USER ?? "moneyexpress",
  host: process.env.DB_HOST ?? "localhost",
  database: process.env.DB_NAME ?? "pawnsystemdb",
  password: process.env.DB_PASSWORD ?? "0236",
  port: Number(process.env.DB_PORT ?? 5432),
});

export type DbClient = PoolClient;

export const connect = async (): Promise<DbClient> => {
  return pool.connect();
};
