import type { DbClient } from "../connection.ts";

const HOLIDAYS = [
  ["2026-01-01", "New Year's Day"],
  ["2026-02-16", "Family Day"],
  ["2026-04-03", "Good Friday"],
  ["2026-05-18", "Victoria Day"],
  ["2026-07-01", "Canada Day"],
  ["2026-09-07", "Labour Day"],
  ["2026-10-12", "Thanksgiving Day"],
  ["2026-11-11", "Remembrance Day"],
  ["2026-12-25", "Christmas Day"],
] as const;

const LOCATION_PREFIXES = [
  "BA",
  "BB",
  "BC",
  "BD",
  "BE",
  "BF",
  "BG",
  "BI",
  "BL",
  "BX",
  "BY",
  "AA",
  "AB",
  "AC",
  "AD",
  "AE",
  "AF",
  "AG",
];

export const seedHolidayDates = async (client: DbClient) => {
  for (const [holidayDate, name] of HOLIDAYS) {
    await client.query(
      `
        INSERT INTO holiday_date (holiday_date, name)
        VALUES ($1, $2)
        ON CONFLICT (holiday_date) DO NOTHING
      `,
      [holidayDate, name],
    );
  }
};

export const seedLocations = async (client: DbClient) => {
  await client.query(
    `
      INSERT INTO location (location, is_active)
      SELECT prefix || first_digit::text || second_digit::text, TRUE
      FROM UNNEST($1::text[]) AS prefixes(prefix)
      CROSS JOIN generate_series(1, 8) AS first_digit
      CROSS JOIN generate_series(1, 5) AS second_digit
      ON CONFLICT (location) DO NOTHING
    `,
    [LOCATION_PREFIXES],
  );

  await client.query(`
    INSERT INTO location (location, is_active)
    VALUES ('BIWK', TRUE)
    ON CONFLICT (location) DO NOTHING
  `);
};
