import path from "path";
import fs from "fs";
import csv from "csv-parser";

export const createCitiesTable = `CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100)
);`;

export async function importCities(client: any) {
  const filePath = path.resolve(__dirname, "../data/canadacities.csv");

  try {
    // await client.query("BEGIN");

    const stream = fs.createReadStream(filePath).pipe(csv());

    let count = 0;
    for await (const row of stream) {
      count++;
      console.log(`⏳ inserting number ${count} row: ${row.city}`);
      const city = row.city_ascii?.trim();
      const province = row.province_name?.trim();
      const country = "Canada";

      if (city && province) {
        await client.query(
          `INSERT INTO cities (city, province, country) VALUES ($1, $2, $3)`,
          [city, province, country]
        );
      }
    }

    // await client.query("COMMIT");
    console.log("✅ All cities have been added。");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error importig cities:", err);
  } finally {
    // client.release();
  }
}
