import { connect } from "../db";

// search customers
export const searchCustomer = async (firstName: string, lastName: string) => {
  const client = await connect();
  const query = `
    SELECT 
      customer_number,
      first_name,
      last_name,
      middle_name,
      date_of_birth,
      gender,
      address,
      city,
      province,
      country,
      postal_code,
      height_cm,
      height_ft,
      weight_kg,
      weight_lb,
      notes,
      picture_path
    FROM customer 
    WHERE 
      (LOWER(first_name) LIKE LOWER($1) || '%' OR $1 = '') 
      AND 
      (LOWER(last_name) LIKE LOWER($2) || '%' OR $2 = '')
    ORDER BY last_name, first_name
  `;

  const values = [
    firstName ? firstName.toLowerCase() : "",
    lastName ? lastName.toLowerCase() : "",
  ];

  try {
    await client.query("BEGIN");
    const result = await client.query(query, values);
    console.log("search customer result (customerCRUD.ts)", result.rows);
    await client.query("COMMIT");
    return result.rows;
  } catch (error) {
    console.error("Error searching customer: (customerCRUD.ts)", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// add new customer
export const addCustomer = async (customer: any, ids: any[]) => {
  const client = await connect();

  const customerQuery = `
  INSERT INTO customer (
    first_name, last_name, middle_name, date_of_birth, gender,
    address, city, province, country, postal_code,
    height_cm, height_ft, weight_kg, weight_lb, notes, picture_path
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
  RETURNING *
`;

  const customerValues = [
    customer.first_name,
    customer.last_name,
    customer.middle_name || null,
    customer.date_of_birth || null,
    customer.gender || null,
    customer.address || null,
    customer.city || null,
    customer.province || null,
    customer.country || null,
    customer.postal_code || null,
    customer.height_cm ? parseFloat(customer.height_cm) : null,
    customer.height_ft ? parseFloat(customer.height_ft) : null,
    customer.weight_kg ? parseFloat(customer.weight_kg) : null,
    customer.weight_lb ? parseFloat(customer.weight_lb) : null,
    customer.notes || null,
    customer.picture_path || null,
  ];

  try {
    await client.query("BEGIN");
    const customerResult = await client.query(customerQuery, customerValues);
    const newCustomer = customerResult.rows[0];

    // add customer identification
    if (ids && ids.length > 0) {
      const idQuery = `
        INSERT INTO customer_identification (customer_number, identification_type, identification_number)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      for (const id of ids) {
        if (id.idType && id.idNumber) {
          await client.query(idQuery, [
            newCustomer.customer_number,
            id.idType,
            id.idNumber,
          ]);
        }
      }
    }

    // get customer identification
    const customerIdsQuery = `
      SELECT * FROM customer_identification 
      WHERE customer_number = $1
    `;
    const customerIdsResult = await client.query(customerIdsQuery, [
      newCustomer.customer_number,
    ]);
    await client.query("COMMIT");
    console.log(
      "Customer identification added (customerCRUD.ts):",
      customerIdsResult.rows
    );
    return customerIdsResult.rows;
  } catch (error) {
    console.log("error", error);
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
    "SELECT DISTINCT province FROM city ORDER BY province ASC ";
  const citiesQuery =
    "SELECT DISTINCT city, province FROM city ORDER BY province ASC, city ASC";

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
    console.log(
      "getCities result (customerCRUD.ts):",
      provinces,
      citiesByProvince
    );
    return { provinces, citiesByProvince };
  } catch (error) {
    console.error("Error getting cities:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
