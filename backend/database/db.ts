import pkg from "pg";
const { Pool } = pkg;
import { createCustomerTable } from "./models/customerTable";
import { createCustomerIDTable } from "./models/customerIDTable";
import { createTicketTable } from "./models/ticketTable";
import { createItemTable } from "./models/itemTable";

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

    console.log("All database tables initialized successfully");

    // Insert test data
    await insertTestData(client);
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Insert test data
const insertTestData = async (client: any) => {
  try {
    // Test customers data
    const customers = [
      {
        firstName: "John",
        lastName: "Smith",
        middleName: "Robert",
        dateOfBirth: "1990-05-15",
        gender: "male",
        address: "123 Main Street",
        city: "Toronto",
        province: "Ontario",
        country: "Canada",
        postalCode: "M5V 2H1",
        heightCm: 180,
        heightFt: 5.91,
        weightKg: 75,
        weightLb: 165.35,
        notes: "Regular customer, prefers morning appointments",
        ids: [
          { idType: "passport", idNumber: "CA12345678" },
          { idType: "driverLicense", idNumber: "DL98765432" },
        ],
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        middleName: "Elizabeth",
        dateOfBirth: "1985-08-22",
        gender: "female",
        address: "456 Queen Street",
        city: "Vancouver",
        province: "British Columbia",
        country: "Canada",
        postalCode: "V6B 1A1",
        heightCm: 165,
        heightFt: 5.41,
        weightKg: 55,
        weightLb: 121.25,
        notes: "VIP customer, frequent visitor",
        ids: [
          { idType: "passport", idNumber: "CA87654321" },
          { idType: "healthCard", idNumber: "HC12345678" },
        ],
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        middleName: "Wei",
        dateOfBirth: "1992-03-10",
        gender: "male",
        address: "789 Yonge Street",
        city: "Toronto",
        province: "Ontario",
        country: "Canada",
        postalCode: "M4W 2G8",
        heightCm: 175,
        heightFt: 5.74,
        weightKg: 70,
        weightLb: 154.32,
        notes: "New customer, interested in jewelry",
        ids: [
          { idType: "passport", idNumber: "CA23456789" },
          { idType: "studentID", idNumber: "STU123456" },
        ],
      },
      {
        firstName: "Emily",
        lastName: "Brown",
        middleName: "Grace",
        dateOfBirth: "1988-11-30",
        gender: "female",
        address: "321 Bloor Street",
        city: "Toronto",
        province: "Ontario",
        country: "Canada",
        postalCode: "M5S 1R8",
        heightCm: 170,
        heightFt: 5.58,
        weightKg: 60,
        weightLb: 132.28,
        notes: "Regular customer, interested in watches",
        ids: [
          { idType: "passport", idNumber: "CA34567890" },
          { idType: "driverLicense", idNumber: "DL23456789" },
          { idType: "healthCard", idNumber: "HC23456789" },
        ],
      },
      {
        firstName: "David",
        lastName: "Wilson",
        middleName: "James",
        dateOfBirth: "1995-07-18",
        gender: "male",
        address: "654 Dundas Street",
        city: "Toronto",
        province: "Ontario",
        country: "Canada",
        postalCode: "M5T 1H6",
        heightCm: 185,
        heightFt: 6.07,
        weightKg: 80,
        weightLb: 176.37,
        notes: "New customer, interested in electronics",
        ids: [
          { idType: "passport", idNumber: "CA45678901" },
          { idType: "driverLicense", idNumber: "DL34567890" },
        ],
      },
    ];

    // Insert each customer and their IDs
    for (const customer of customers) {
      const { ids, ...customerData } = customer;

      // Insert customer
      const customerQuery = `
        INSERT INTO customer (
          first_name, last_name, middle_name, date_of_birth, gender,
          address, city, province, country, postal_code,
          height_cm, height_ft, weight_kg, weight_lb, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING customer_number
      `;

      const customerValues = [
        customerData.firstName,
        customerData.lastName,
        customerData.middleName,
        customerData.dateOfBirth,
        customerData.gender,
        customerData.address,
        customerData.city,
        customerData.province,
        customerData.country,
        customerData.postalCode,
        customerData.heightCm,
        customerData.heightFt,
        customerData.weightKg,
        customerData.weightLb,
        customerData.notes,
      ];

      const customerResult = await client.query(customerQuery, customerValues);
      const customerNumber = customerResult.rows[0].customer_number;

      // Insert IDs
      for (const id of ids) {
        const idQuery = `
          INSERT INTO customer_identification (
            customer_number, identification_type, identification_number
          ) VALUES ($1, $2, $3)
        `;
        await client.query(idQuery, [customerNumber, id.idType, id.idNumber]);
      }

      console.log(
        `Added customer: ${customerData.firstName} ${customerData.lastName}`
      );
    }

    console.log("Test data inserted successfully");
  } catch (error) {
    console.error("Error inserting test data:", error);
    throw error;
  }
};

// initializeDatabase();
