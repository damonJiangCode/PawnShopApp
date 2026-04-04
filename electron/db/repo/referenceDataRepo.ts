import { connect } from "../table/createTable.ts";

export type CitiesResponse = {
  provinces: string[];
  citiesByProvince: Record<string, string[]>;
};

export const loadIdTypes = async (): Promise<string[]> => {
  const client = await connect();
  const query = "SELECT * FROM id_type";

  try {
    const result = await client.query(query);
    return result.rows.map((row) => row.type);
  } finally {
    client.release();
  }
};

export const loadCities = async (): Promise<CitiesResponse> => {
  const client = await connect();
  const provincesQuery =
    "SELECT DISTINCT province FROM city ORDER BY province ASC";
  const citiesQuery =
    "SELECT DISTINCT city, province FROM city ORDER BY province ASC, city ASC";

  try {
    const provincesResult = await client.query(provincesQuery);
    const citiesResult = await client.query(citiesQuery);

    const provinces = provincesResult.rows.map((row) => row.province);
    const citiesByProvince: Record<string, string[]> = {};

    for (const row of citiesResult.rows) {
      if (!citiesByProvince[row.province]) {
        citiesByProvince[row.province] = [];
      }

      citiesByProvince[row.province].push(row.city);
    }

    return { provinces, citiesByProvince };
  } finally {
    client.release();
  }
};

export const loadHairColors = async (): Promise<string[]> => {
  const client = await connect();
  const query = "SELECT * FROM hair_color ORDER BY color ASC";

  try {
    const result = await client.query(query);
    return result.rows.map((row) => row.color);
  } finally {
    client.release();
  }
};

export const loadEyeColors = async (): Promise<string[]> => {
  const client = await connect();
  const query = "SELECT * FROM eye_color ORDER BY color ASC";

  try {
    const result = await client.query(query);
    return result.rows.map((row) => row.color);
  } finally {
    client.release();
  }
};

export const referenceDataRepo = {
  loadCities,
  loadEyeColors,
  loadHairColors,
  loadIdTypes,
};
