import pkg from "pg";
const { Pool } = pkg;
import { createClientsTable } from "./clientsTable.ts";
import { createClientIDsTable } from "./clientIDsTable.ts";
import { createTicketsTable } from "./ticketsTable.ts";
import { createItemsTable } from "./itemsTable.ts";
import { createCitiesTable, importCities } from "./citiesTable.ts";
import {
  createHairColorsTable,
  insertHairColors,
} from "./hairColorsTable.ts";
import { createEyeColorsTable, insertEyeColors } from "./eyeColorsTable.ts";
import { createIDTypesTable, insertIDTypes } from "./IDTypesTable.ts";
import { createEmployeesTable } from "./employeesTable.ts";

// create pool connection
const pool = new Pool({
  user: "pawnsystem",
  host: "localhost",
  database: "pawnsystemdb",
  password: "0236",
  port: 5432,
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
    // create clients table
    await client.query(createClientsTable);
    console.log("clients table created successfully");

    // create client IDs table
    await client.query(createClientIDsTable);
    console.log("client_ids table created successfully");
    // create tickets table
    await client.query(createTicketsTable);
    console.log("tickets table created successfully");

    // create items table
    await client.query(createItemsTable);
    console.log("items table created successfully");

    // create cities table
    await client.query(createCitiesTable);
    console.log("cities table created successfully");
    // import cities
    await importCities(client);
    console.log("cities imported successfully");

    // create hair colors table
    await client.query(createHairColorsTable);
    console.log("hair_colors table created successfully");
    // import hair colors
    await client.query(insertHairColors);
    console.log("hair colors inserted successfully");

    // create eye colors table
    await client.query(createEyeColorsTable);
    console.log("eye_colors table created successfully");
    // import eye colors
    await client.query(insertEyeColors);
    console.log("eye colors inserted successfully");

    // create id types table
    await client.query(createIDTypesTable);
    console.log("id_types table created successfully");
    // import id types
    await client.query(insertIDTypes);
    console.log("ID types inserted successfully");

    // create employees table
    await client.query(createEmployeesTable);
    console.log("employees table created successfully");

    console.log("All database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
};

// initializeDatabase();
