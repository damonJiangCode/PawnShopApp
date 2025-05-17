import pkg from "pg";
const { Pool } = pkg;
import { createCustomerTable } from "./models/customerTable";
import { createCustomerIDTable } from "./models/customerIDTable";
import { createTicketTable } from "./models/ticketTable";
import { createItemTable } from "./models/itemTable";
import { createCityTable } from "./models/cityTable";

// create pool connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
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
    // create customer table
    await client.query(createCustomerTable);
    console.log("Customer table created successfully");

    // create customer ID table
    await client.query(createCustomerIDTable);
    console.log("Customer ID table created successfully");

    // create ticket table
    await client.query(createTicketTable);
    console.log("Ticket table created successfully");

    // create item table
    await client.query(createItemTable);
    console.log("Item table created successfully");

    // create city table
    await client.query(createCityTable);
    console.log("City table created successfully");

    console.log("All database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    client.release();
  }
};

// initializeDatabase()
