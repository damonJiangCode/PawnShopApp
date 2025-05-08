import pkg from "pg";
const { Pool } = pkg;
import { createCustomersTable } from "./models/customersTable.ts";
import { createCustomerIDTable } from "./models/customerIDTable.ts";

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
    // create customers table
    await client.query(createCustomersTable);
    console.log("Customers table created successfully");

    // create customer ID table
    await client.query(createCustomerIDTable);
    console.log("Customer ID table created successfully");

    console.log("All database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};

// connect()
// initializeDatabase();
