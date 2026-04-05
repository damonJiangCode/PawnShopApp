import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const { Pool } = pkg;
import { createClientTable } from "./clientTable.ts";
import { createClientIDTable } from "./clientIDTable.ts";
import { createTicketTable } from "./ticketTable.ts";
import { createItemTable } from "./itemTable.ts";
import { createCityTable, importCity } from "./cityTable.ts";
import { createHairColorTable, insertHairColor } from "./hairColorTable.ts";
import { createEyeColorTable, insertEyeColor } from "./eyeColorTable.ts";
import { createIDTypeTable, insertIDType } from "./IDTypeTable.ts";
import { createEmployeeTable } from "./employeeTable.ts";
import { createLocationTable } from "./locationTable.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEnvFile = () => {
  const envPath = path.resolve(__dirname, "../../../.env");
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

// create pool connection
const pool = new Pool({
  user: process.env.DB_USER ?? "damon",
  host: process.env.DB_HOST ?? "localhost",
  database: process.env.DB_NAME ?? "PawnShopDB",
  password: process.env.DB_PASSWORD ?? "0236",
  port: Number(process.env.DB_PORT ?? 5432),
});

// connect to database
export const connect = async () => {
  const client = await pool.connect();
  return client;
};

// initialize database
export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // create client table
    await client.query(createClientTable);
    console.log("client table created successfully");

    // create client id table
    await client.query(createClientIDTable);
    console.log("client_id table created successfully");
    // create ticket table
    await client.query(createTicketTable);
    console.log("ticket table created successfully");
    await client.query(`
      ALTER TABLE ticket
      ADD COLUMN IF NOT EXISTS is_lost BOOLEAN NOT NULL DEFAULT FALSE
    `);
    console.log("ticket is_lost column ensured successfully");
    await client.query(
      `ALTER TABLE ticket DROP CONSTRAINT IF EXISTS ticket_status_check`,
    );
    await client.query(`
      ALTER TABLE ticket
      ADD CONSTRAINT ticket_status_check
      CHECK (status IN ('pawned', 'picked_up', 'expired', 'sold'))
    `);
    console.log("ticket status constraint updated successfully");

    // create item table
    await client.query(createItemTable);
    console.log("item table created successfully");

    // create city table
    await client.query(createCityTable);
    console.log("city table created successfully");
    // import city
    await importCity(client);
    console.log("city imported successfully");

    // create hair color table
    await client.query(createHairColorTable);
    console.log("hair_color table created successfully");
    // import hair color
    await client.query(insertHairColor);
    console.log("hair color inserted successfully");

    // create eye color table
    await client.query(createEyeColorTable);
    console.log("eye_color table created successfully");
    // import eye color
    await client.query(insertEyeColor);
    console.log("eye color inserted successfully");

    // create id type table
    await client.query(createIDTypeTable);
    console.log("id_type table created successfully");
    // import id type
    await client.query(insertIDType);
    console.log("id type inserted successfully");

    // create employee table
    await client.query(createEmployeeTable);
    console.log("employee table created successfully");

    // create location table
    await client.query(createLocationTable);
    console.log("location table created successfully");

    console.log("All database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};

// initializeDatabase();
