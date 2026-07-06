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

const expandLocationRange = (prefix: string, start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_value, index) => {
    return `${prefix}${start + index}`;
  });

const LOCATION_CODES = [
  ...expandLocationRange("AA", 11, 14),
  ...expandLocationRange("AA", 21, 27),
  ...expandLocationRange("AA", 31, 37),
  ...expandLocationRange("AA", 41, 47),
  ...expandLocationRange("AA", 51, 57),
  ...expandLocationRange("AA", 61, 64),
  ...expandLocationRange("AA", 71, 74),
  ...expandLocationRange("AA", 81, 87),
  ...expandLocationRange("AA", 91, 97),
  ...expandLocationRange("AB", 11, 17),
  ...expandLocationRange("AB", 21, 27),
  ...expandLocationRange("AB", 31, 37),
  ...expandLocationRange("AB", 41, 47),
  ...expandLocationRange("AB", 51, 57),
  ...expandLocationRange("AB", 61, 66),
  ...expandLocationRange("AB", 71, 76),
  ...expandLocationRange("AB", 81, 86),
  ...expandLocationRange("AB", 91, 96),
  ...expandLocationRange("AC", 11, 17),
  ...expandLocationRange("AC", 21, 27),
  ...expandLocationRange("AC", 31, 37),
  ...expandLocationRange("AC", 41, 43),
  ...expandLocationRange("AC", 51, 57),
  ...expandLocationRange("AC", 61, 67),
  ...expandLocationRange("AC", 71, 77),
  ...expandLocationRange("AC", 81, 87),
  ...expandLocationRange("AD", 11, 14),
  ...expandLocationRange("AD", 21, 24),
  ...expandLocationRange("AD", 31, 34),
  ...expandLocationRange("AD", 41, 43),
  ...expandLocationRange("AD", 51, 54),
  ...expandLocationRange("AD", 61, 64),
  ...expandLocationRange("AD", 71, 74),
  ...expandLocationRange("AD", 81, 84),
  ...expandLocationRange("AD", 91, 94),
  ...expandLocationRange("AE", 11, 14),
  ...expandLocationRange("AE", 21, 24),
  ...expandLocationRange("AE", 31, 34),
  ...expandLocationRange("AE", 41, 43),
  ...expandLocationRange("AE", 51, 54),
  ...expandLocationRange("AE", 61, 64),
  ...expandLocationRange("AE", 71, 74),
  ...expandLocationRange("AE", 81, 84),
  ...expandLocationRange("AE", 91, 94),
  ...expandLocationRange("AF", 11, 16),
  ...expandLocationRange("AF", 21, 26),
  ...expandLocationRange("AF", 31, 36),
  ...expandLocationRange("AF", 41, 46),
  ...expandLocationRange("AF", 51, 55),
  ...expandLocationRange("AF", 61, 65),
  ...expandLocationRange("AF", 71, 77),
  ...expandLocationRange("AF", 81, 87),
  ...expandLocationRange("AF", 91, 97),
  ...expandLocationRange("AG", 11, 16),
  ...expandLocationRange("AG", 21, 26),
  ...expandLocationRange("AG", 31, 36),
  ...expandLocationRange("AG", 41, 46),
  ...expandLocationRange("AG", 51, 55),
  ...expandLocationRange("AG", 61, 65),
  ...expandLocationRange("AG", 71, 77),
  ...expandLocationRange("AG", 81, 87),
  ...expandLocationRange("AG", 91, 97),
  ...expandLocationRange("AX", 11, 16),
  ...expandLocationRange("AX", 21, 26),
  ...expandLocationRange("AX", 31, 35),
  ...expandLocationRange("AX", 41, 45),
  ...expandLocationRange("AX", 51, 55),
  ...expandLocationRange("AX", 61, 65),
  ...expandLocationRange("AX", 71, 75),
  ...expandLocationRange("AX", 81, 85),
  ...expandLocationRange("AX", 91, 95),
  ...expandLocationRange("AY", 11, 13),
  ...expandLocationRange("AY", 21, 23),
  ...expandLocationRange("AY", 31, 34),
  ...expandLocationRange("AY", 41, 44),
  ...expandLocationRange("AY", 51, 53),
  ...expandLocationRange("AY", 61, 63),
  ...expandLocationRange("AZ", 11, 12),
  ...expandLocationRange("AZ", 21, 22),
  ...expandLocationRange("AZ", 31, 32),
  ...expandLocationRange("AZ", 41, 42),
  ...expandLocationRange("AZ", 51, 52),
  ...expandLocationRange("AZ", 61, 62),
  ...expandLocationRange("AZ", 71, 73),
  ...expandLocationRange("AZ", 81, 83),
  ...expandLocationRange("AH", 11, 15),
  ...expandLocationRange("AH", 21, 25),
  ...expandLocationRange("AH", 31, 34),
  ...expandLocationRange("CP", 1, 15),
  "F8",
  "F9",
  "F10",
  "AK",
  ...Array.from({ length: 26 }, (_value, index) => {
    return `RR-${String.fromCharCode(65 + index)}`;
  }),
  "RR11",
  "RR12",
  "RR13",
  "W-L",
  "W-M",
] as const;

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
      SELECT code, TRUE
      FROM UNNEST($1::text[]) AS seed(code)
      ON CONFLICT (location) DO NOTHING
    `,
    [LOCATION_CODES],
  );
};
