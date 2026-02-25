import { initializeDatabase } from "./tables/createTables.ts";

const run = async () => {
  try {
    await initializeDatabase();
    console.log("Database initialization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

void run();
