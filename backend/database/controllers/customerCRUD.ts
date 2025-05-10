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
      picture_url
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
    const result = await client.query(query, values);
    console.log("search customer result (from customerCRUD.ts)", result.rows);
    return result.rows;
  } catch (error) {
    console.error("Error searching customer: (from customerCRUD.ts)", error);
    throw error;
  } finally {
    client.release();
  }
};

// add new customer
export const addCustomer = async (customerData: any, ids: any[]) => {
  // start transaction
  const client = await connect();
  try {
    await client.query("BEGIN");

    // insert customer data
    const customerQuery = `
      INSERT INTO customer (
        first_name, last_name, middle_name, date_of_birth, gender,
        address, city, province, country, postal_code,
        height_cm, height_ft, weight_kg, weight_lb, notes, picture_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const customerValues = [
      customerData.firstName,
      customerData.lastName,
      customerData.middleName || null,
      customerData.dateOfBirth || null,
      customerData.gender || null,
      customerData.address || null,
      customerData.city || null,
      customerData.province || null,
      customerData.country || null,
      customerData.postalCode || null,
      customerData.heightCm ? parseFloat(customerData.heightCm) : null,
      customerData.heightFt ? parseFloat(customerData.heightFt) : null,
      customerData.weightKg ? parseFloat(customerData.weightKg) : null,
      customerData.weightLb ? parseFloat(customerData.weightLb) : null,
      customerData.notes || null,
      customerData.pictureUrl || null,
    ];

    const customerResult = await client.query(customerQuery, customerValues);
    const newCustomer = customerResult.rows[0];

    // insert identification information
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

    // 查询该客户的所有证件信息
    const customerIdsQuery = `
      SELECT * FROM customer_identification 
      WHERE customer_number = $1
    `;
    const customerIdsResult = await client.query(customerIdsQuery, [
      newCustomer.customer_number,
    ]);

    await client.query("COMMIT");
    console.log("New customer added:", newCustomer);
    console.log("Customer's identifications:", customerIdsResult.rows);
    return newCustomer;
  } catch (error) {
    console.log("error", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// find customer
export const findCustomer = async (id: number) => {
  const client = await connect();
  const query = "SELECT * FROM customer WHERE customer_number = $1";
  try {
    const result = await client.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding customer:", error);
    throw error;
  }
};

// update customer information
export const updateCustomer = async (id: number, customerData: any) => {
  const client = await connect();
  const {
    firstName,
    lastName,
    middleName,
    dateOfBirth,
    gender,
    address,
    city,
    province,
    country,
    postalCode,
    heightCm,
    heightFt,
    weightKg,
    weightLb,
    notes,
    pictureUrl,
  } = customerData;

  const query = `
    UPDATE customer 
    SET first_name = $1, last_name = $2, middle_name = $3, date_of_birth = $4, 
        gender = $5, address = $6, city = $7, province = $8, country = $9, 
        postal_code = $10, height_cm = $11, height_ft = $12, weight_kg = $13, 
        weight_lb = $14, notes = $15, picture_url = $16
    WHERE customer_number = $17
    RETURNING *
  `;

  const values = [
    firstName,
    lastName,
    middleName,
    dateOfBirth,
    gender,
    address,
    city,
    province,
    country,
    postalCode,
    heightCm,
    heightFt,
    weightKg,
    weightLb,
    notes,
    pictureUrl,
    id,
  ];

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// delete customer
export const deleteCustomer = async (id: number) => {
  const client = await connect();
  const query = "DELETE FROM customer WHERE customer_number = $1";
  try {
    await client.query(query, [id]);
    return true;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

// // 客户基本信息
// const customerData = {
//   firstName: "John",
//   lastName: "Smith",
//   middleName: "Robert",
//   dateOfBirth: "1990-05-15",
//   gender: "male",
//   address: "123 Main Street",
//   city: "Toronto",
//   province: "Ontario",
//   country: "Canada",
//   postalCode: "M5V 2H1",
//   heightCm: "180",
//   heightFt: "5.91",
//   weightKg: "75",
//   weightLb: "165.35",
//   notes: "Regular customer, prefers morning appointments",
//   pictureUrl: null,
// };

// // 证件信息
// const ids = [
//   {
//     idType: "passport",
//     idNumber: "CA12345678",
//   },
//   {
//     idType: "driverLicense",
//     idNumber: "DL98765432",
//   },
// ];

// 使用示例
// try {
//   const newCustomer = await addCustomer(customerData, ids);
// } catch (error) {
//   console.error("Error adding customer:", error);
// }
