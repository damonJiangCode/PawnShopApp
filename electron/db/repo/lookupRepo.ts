import { connect } from "../tables/createTables.ts";

export const getIdTypes = async (): Promise<string[]> => {
  const client = await connect();
  const query = "SELECT * FROM id_types";
  try {
    await client.query("BEGIN");
    const result = await client.query(query);
    await client.query("COMMIT");
    return result.rows.map((row) => row.type);
  } catch (error) {
    console.error("[lookupRepository] ERROR getting ID types:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getCities = async (): Promise<{
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
}> => {
  const client = await connect();
  const provincesQuery =
    "SELECT DISTINCT province FROM cities ORDER BY province ASC";
  const citiesQuery =
    "SELECT DISTINCT city, province FROM cities ORDER BY province ASC, city ASC";

  try {
    await client.query("BEGIN");
    const provincesResult = await client.query(provincesQuery);
    const citiesResult = await client.query(citiesQuery);
    await client.query("COMMIT");

    const provinces = provincesResult.rows.map((row) => row.province);
    const citiesByProvince: Record<string, string[]> = {};

    for (const row of citiesResult.rows) {
      if (!citiesByProvince[row.province]) {
        citiesByProvince[row.province] = [];
      }
      citiesByProvince[row.province].push(row.city);
    }
    return { provinces, citiesByProvince };
  } catch (error) {
    console.error("[lookupRepository] ERROR getting cities:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getHairColors = async (): Promise<string[]> => {
  const client = await connect();
  const query = "SELECT * FROM hair_colors ORDER BY color ASC";
  try {
    await client.query("BEGIN");
    const result = await client.query(query);
    await client.query("COMMIT");
    return result.rows.map((row) => row.color);
  } catch (error) {
    console.error("[lookupRepository] ERROR getting hair colors:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getEyeColors = async (): Promise<string[]> => {
  const client = await connect();
  const query = "SELECT * FROM eye_colors ORDER BY color ASC";
  try {
    await client.query("BEGIN");
    const result = await client.query(query);
    await client.query("COMMIT");
    return result.rows.map((row) => row.color);
  } catch (error) {
    console.error("[lookupRepository] ERROR getting eye colors:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
