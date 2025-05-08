import { connect } from "../db.ts";

// search customers
export const searchCustomers = async (firstName: string, lastName: string) => {
  const client = await connect();
  const query = `
    SELECT 
      id,
      first_name as "firstName",
      last_name as "lastName",
      middle_name as "middleName",
      date_of_birth as "dateOfBirth",
      gender,
      address,
      city,
      province,
      country,
      postal_code as "postalCode",
      height_cm as "heightCm",
      height_ft as "heightFt",
      weight_kg as "weightKg",
      weight_lb as "weightLb",
      notes,
      picture_url as "pictureUrl"
    FROM customers 
    WHERE 
      (first_name ILIKE $1 OR $1 = '') 
      AND 
      (last_name ILIKE $2 OR $2 = '')
    ORDER BY last_name, first_name
  `;

  const values = [
    firstName ? `%${firstName}%` : "",
    lastName ? `%${lastName}%` : "",
  ];

  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error searching customers:", error);
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
      INSERT INTO customers (
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
        INSERT INTO customer_id (customer_id, id_type, id_number)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      for (const id of ids) {
        if (id.idType && id.idNumber) {
          await client.query(idQuery, [newCustomer.id, id.idType, id.idNumber]);
        }
      }
    }

    // 查询该客户的所有证件信息
    const customerIdsQuery = `
      SELECT * FROM customer_id 
      WHERE customer_id = $1
    `;
    const customerIdsResult = await client.query(customerIdsQuery, [
      newCustomer.id,
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
  const query = "SELECT * FROM customers WHERE id = $1";
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
    UPDATE customers 
    SET first_name = $1, last_name = $2, middle_name = $3, date_of_birth = $4, 
        gender = $5, address = $6, city = $7, province = $8, country = $9, 
        postal_code = $10, height_cm = $11, height_ft = $12, weight_kg = $13, 
        weight_lb = $14, notes = $15, picture_url = $16
    WHERE id = $17
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
  const query = "DELETE FROM customers WHERE id = $1";
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
