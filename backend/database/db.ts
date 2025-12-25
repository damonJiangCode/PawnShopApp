import pkg from "pg";
const { Pool } = pkg;
import { createCustomersTable } from "./models/customersTable";
import { createCustomerIDsTable } from "./models/customerIDsTable";
import { createTicketsTable } from "./models/ticketsTable";
import { createItemsTable } from "./models/itemsTable";
import { createCitiesTable, importCities } from "./models/citiesTable";
import {
  createHairColorsTable,
  insertHairColors,
} from "./models/hairColorsTable";
import { createEyeColorsTable, insertEyeColors } from "./models/eyeColorsTable";
import { createIdTypesTable, insertIdTypes } from "./models/idTypesTable";

// create pool connection
const pool = new Pool({
  user: "damon",
  host: "localhost",
  database: "PawnShop DB",
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
    // create customers table
    await client.query(createCustomersTable);
    console.log("customers table created successfully");

    // create customer IDs table
    await client.query(createCustomerIDsTable);
    console.log("customer_identifications table created successfully");

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
    console.log("Cities imported successfully");

    // create hair colors table
    await client.query(createHairColorsTable);
    console.log("Hair color table created successfully");
    // import hair colors
    await client.query(insertHairColors);
    console.log("Hair colors inserted successfully");

    // create eye colors table
    await client.query(createEyeColorsTable);
    console.log("Eye color table created successfully");
    // import eye colors
    await client.query(insertEyeColors);
    console.log("Eye colors inserted successfully");

    // create id types table
    await client.query(createIdTypesTable);
    console.log("ID types table created successfully");
    // import id types
    await client.query(insertIdTypes);
    console.log("ID types inserted successfully");

    console.log("All database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
};

// initializeDatabase();
