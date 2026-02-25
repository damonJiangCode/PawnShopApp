import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createCitiesTable = `
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    city TEXT,
    province TEXT,
    country TEXT
);
`;

export async function importCities(client: any) {
  const filePath = path.resolve(__dirname, "../seed/canadacities.csv");

  try {
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

    console.log("✅ All cities have been added。");
  } catch (err) {
    console.error("❌ Error importing cities:", err);
    throw err;
  }
}
