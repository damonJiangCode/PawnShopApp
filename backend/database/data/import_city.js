const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Pool } = require("pg");

// PostgreSQL configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});

const filePath = path.resolve(__dirname, "canadacities.csv");

async function importCities() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const stream = fs.createReadStream(filePath).pipe(csv());

    let count = 0;
    for await (const row of stream) {
      count++;
      console.log(`⏳ 插入第 ${count} 行: ${row.city}`);
      const city = row.city_ascii?.trim();
      const province = row.province_name?.trim();
      const country = "Canada";

      if (city && province) {
        await client.query(
          `INSERT INTO city (city, province, country) VALUES ($1, $2, $3)`,
          [city, province, country]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ All cities have been added。");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error importig cities:", err);
  } finally {
    client.release();
  }
}

importCities();
