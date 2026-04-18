import { connect } from "./connection.ts";
import { createCityTable, importCity } from "./schema/client/cityTable.ts";
import { createClientIDTable } from "./schema/client/clientIdTable.ts";
import { createClientTable } from "./schema/client/clientTable.ts";
import {
  createEyeColorTable,
  insertEyeColor,
} from "./schema/client/eyeColorTable.ts";
import {
  createHairColorTable,
  insertHairColor,
} from "./schema/client/hairColorTable.ts";
import {
  createIDTypeTable,
  insertIDType,
} from "./schema/client/idTypeTable.ts";
import { createEmployeeTable } from "./schema/employee/employeeTable.ts";
import {
  createItemCategoryTable,
  insertItemCategory,
} from "./schema/item/itemCategoryTable.ts";
import {
  createItemSubcategoryTable,
  insertItemSubcategory,
} from "./schema/item/itemSubcategoryTable.ts";
import {
  createItemIndexes,
  createItemTable,
} from "./schema/item/itemTable.ts";
import {
  createLocationTable,
  insertLocation,
} from "./schema/ticket/locationTable.ts";
import {
  createTicketIndexes,
  createTicketTable,
} from "./schema/ticket/ticketTable.ts";

export const initializeDatabase = async () => {
  const client = await connect();

  try {
    await client.query(createCityTable);
    console.log("city table created successfully");
    await importCity(client);
    console.log("city imported successfully");

    await client.query(createHairColorTable);
    console.log("hair_color table created successfully");
    await client.query(insertHairColor);
    console.log("hair color inserted successfully");

    await client.query(createEyeColorTable);
    console.log("eye_color table created successfully");
    await client.query(insertEyeColor);
    console.log("eye color inserted successfully");

    await client.query(createIDTypeTable);
    console.log("id_type table created successfully");
    await client.query(insertIDType);
    console.log("id type inserted successfully");

    await client.query(createClientTable);
    console.log("client table created successfully");

    await client.query(createClientIDTable);
    console.log("client_id table created successfully");

    await client.query(createTicketTable);
    console.log("ticket table created successfully");

    await client.query(createTicketIndexes);
    console.log("ticket indexes created successfully");

    await client.query(createItemCategoryTable);
    console.log("item_category table created successfully");
    await client.query(insertItemCategory);
    console.log("item_category seeded successfully");

    await client.query(createItemSubcategoryTable);
    console.log("item_subcategory table created successfully");
    await client.query(insertItemSubcategory);
    console.log("item_subcategory seeded successfully");

    await client.query(createItemTable);
    console.log("item table created successfully");

    await client.query(createItemIndexes);
    console.log("item subcategory index ensured successfully");

    await client.query(createEmployeeTable);
    console.log("employee table created successfully");

    await client.query(createLocationTable);
    console.log("location table created successfully");
    await insertLocation(client);
    console.log("location inserted successfully");

    console.log("All database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};
