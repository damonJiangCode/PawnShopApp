import { Customer, ID } from "../../../shared/models/Customer";
import { connect } from "../db";

// search customers
export const searchCustomer = async (firstName: string, lastName: string) => {
  const client = await connect();
  const query = `
    SELECT 
      c.*,
      COALESCE(
        json_agg(
          jsonb_build_object(
            'id', ci.id,
            'id_type', ci.id_type,
            'id_number', ci.id_number,
            'updated_at', ci.updated_at
          )
        ) FILTER (WHERE ci.id IS NOT NULL), '[]'
      ) AS identifications
    FROM customers c
    LEFT JOIN customer_ids ci
      ON c.customer_number = ci.customer_number
    WHERE 
      (LOWER(c.first_name) LIKE LOWER($1) || '%' OR $1 = '') 
      AND 
      (LOWER(c.last_name) LIKE LOWER($2) || '%' OR $2 = '')
    GROUP BY c.customer_number
    ORDER BY c.last_name, c.first_name
  `;

  const values = [
    firstName ? firstName.toLowerCase() : "",
    lastName ? lastName.toLowerCase() : "",
  ];

  try {
    await client.query("BEGIN");
    const result = await client.query(query, values);
    await client.query("COMMIT");
    const customers = result.rows.map((row) => ({
      ...row,
      identifications: row.identifications || [],
    }));
    // console.log(
    //   "Formatted customers (customerCRUD.ts):",
    //   JSON.stringify(customers, null, 2)
    // );
    return customers;
  } catch (error) {
    console.error("Error searching customer: (customerCRUD.ts)", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// add new customer
export const addCustomer = async (
  customer: Customer,
  identifications: ID[]
): Promise<Customer> => {
  const client = await connect();

  // add customer SQL
  const customerQuery = `
    INSERT INTO customers (
      first_name, last_name, middle_name, date_of_birth, gender,
      hair_color, eye_color, address, city, province, country, postal_code,
      height_cm, weight_kg, notes, picture_path, email, phone,
      redeem_count, expire_count, overdue_count, theft_count
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 0, 0, 0, 0)
    RETURNING *
  `;

  const customerValues = [
    customer.first_name,
    customer.last_name,
    customer.middle_name || null,
    customer.date_of_birth,
    customer.gender,
    customer.hair_color,
    customer.eye_color,
    customer.address,
    customer.city,
    customer.province,
    customer.country,
    customer.postal_code,
    customer.height_cm,
    customer.weight_kg,
    customer.notes || null,
    customer.picture_path,
    customer.email || null,
    customer.phone || null,
  ];

  try {
    await client.query("BEGIN");

    // insert new customer
    const customerResult = await client.query(customerQuery, customerValues);
    const newCustomer = customerResult.rows[0];
    const customerNumber = newCustomer.customer_number;

    // insert identifications
    if (identifications && identifications.length > 0) {
      const idQuery = `
        INSERT INTO customer_ids (customer_number, id_type, id_number)
        VALUES ($1, $2, $3)
      `;
      for (const id of identifications) {
        if (id.id_type && id.id_number) {
          await client.query(idQuery, [
            customerNumber,
            id.id_type,
            id.id_number,
          ]);
        }
      }
    }

    // check identifications
    const customerIdsQuery = `
      SELECT id, id_type, id_number, updated_at
      FROM customer_ids
      WHERE customer_number = $1
    `;
    const customerIdsResult = await client.query(customerIdsQuery, [
      customerNumber,
    ]);

    await client.query("COMMIT");

    // return new customer with IDs
    const result: Customer = {
      ...newCustomer,
      identifications: customerIdsResult.rows,
    };

    console.log(" New customer added (customerCRUD.ts):", result);
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error in addCustomer:", error);
    alert("Failed to add customer (customerCRUD.ts).");
    throw error;
  } finally {
    client.release();
  }
};

// get customer's IDs
export const getIds = async (customerID: number) => {
  const client = await connect();
  const query = `
    SELECT id_type, id_number
    FROM customer_identifications 
    WHERE customer_number = $1
  `;
  try {
    await client.query("BEGIN");
    const result = await client.query(query, [customerID]);
    await client.query("COMMIT");
    // console.log("getIds result (customerCRUD.ts):", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error getting customer IDs (customerCRUD.ts):", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// get ID types
export const getIdTypes = async () => {
  const client = await connect();
  const query = "SELECT * FROM id_types";
  try {
    await client.query("BEGIN");
    const result = await client.query(query);
    await client.query("COMMIT");
    const idTypes = result.rows.map((row) => row.type);
    // console.log("getIdTypes result (customerCRUD.ts):", idTypes);
    return idTypes;
  } catch (error) {
    console.error("Error getting ID types:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// get cities
export const getCities = async () => {
  const client = await connect();
  const provincesQuery =
    "SELECT DISTINCT province FROM cities ORDER BY province ASC ";
  const citiesQuery =
    "SELECT DISTINCT city, province FROM cities ORDER BY province ASC, city ASC";

  try {
    await client.query("BEGIN");
    const provincesResult = await client.query(provincesQuery);
    const citiesResult = await client.query(citiesQuery);
    await client.query("COMMIT");

    const provinces = provincesResult.rows.map((row) => row.province);
    const citiesByProvince: { [key: string]: string[] } = {};

    for (const row of citiesResult.rows) {
      if (!citiesByProvince[row.province]) {
        citiesByProvince[row.province] = [];
      }
      citiesByProvince[row.province].push(row.city);
    }
    // console.log(
    //   "getCities result (customerCRUD.ts):",
    //   provinces,
    //   citiesByProvince
    // );
    return { provinces, citiesByProvince };
  } catch (error) {
    console.error("Error getting cities:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// get hair colors
export const getHairColors = async () => {
  const client = await connect();
  const query = "SELECT * FROM hair_colors ORDER BY color ASC";
  try {
    await client.query("BEGIN");
    const result = await client.query(query);
    await client.query("COMMIT");
    const hairColors = result.rows.map((row) => row.color);
    // console.log("getHairColors result (customerCRUD.ts):", hairColors);
    return hairColors;
  } catch (error) {
    console.error("Error getting hair colors:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// get eye colors
export const getEyeColors = async () => {
  const client = await connect();
  const query = "SELECT * FROM eye_colors ORDER BY color ASC";
  try {
    await client.query("BEGIN");
    const result = await client.query(query);
    await client.query("COMMIT");
    const eyeColors = result.rows.map((row) => row.color);
    // console.log("getEyeColors result (customerCRUD.ts):", eyeColors);
    return eyeColors;
  } catch (error) {
    console.error("Error getting eye colors:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
