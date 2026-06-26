import { connect } from "../../db/connection.ts";
import type { CitiesResponse } from "../../shared/types/clientApiTypes.ts";
import type { EyeColor } from "../../shared/types/eyeColor.ts";
import type { HairColor } from "../../shared/types/hairColor.ts";

type ColorOption = EyeColor | HairColor;

const mapColorOptionRow = (row: Record<string, unknown>): ColorOption => ({
  color: String(row.color),
  is_active: Boolean(row.is_active),
});

const loadActiveColors = async (tableName: "eye_color" | "hair_color") => {
  const client = await connect();
  const query = `
    SELECT UPPER(color) AS color
    FROM ${tableName}
    WHERE is_active = TRUE
    ORDER BY color ASC
  `;

  try {
    const result = await client.query(query);
    return result.rows.map((row) => row.color);
  } finally {
    client.release();
  }
};

const loadAdminColors = async (
  tableName: "eye_color" | "hair_color",
): Promise<ColorOption[]> => {
  const client = await connect();
  const query = `
    SELECT UPPER(color) AS color, is_active
    FROM ${tableName}
    ORDER BY is_active DESC, color ASC
  `;

  try {
    const result = await client.query(query);
    return result.rows.map(mapColorOptionRow);
  } finally {
    client.release();
  }
};

const addColor = async (tableName: "eye_color" | "hair_color", color: string) => {
  const client = await connect();
  const query = `
    INSERT INTO ${tableName} (color, is_active)
    SELECT $1, TRUE
    WHERE NOT EXISTS (
      SELECT 1 FROM ${tableName} WHERE LOWER(color) = LOWER($1)
    )
    RETURNING color
  `;

  try {
    const result = await client.query(query, [color]);
    return result.rows[0] ? String(result.rows[0].color) : null;
  } finally {
    client.release();
  }
};

const setColorActive = async (
  tableName: "eye_color" | "hair_color",
  color: string,
  isActive: boolean,
): Promise<ColorOption | null> => {
  const client = await connect();
  const query = `
    UPDATE ${tableName}
    SET is_active = $1
    WHERE UPPER(color) = $2 AND is_active = $3
    RETURNING UPPER(color) AS color, is_active
  `;

  try {
    const result = await client.query(query, [isActive, color, !isActive]);
    const row = result.rows[0];
    return row ? mapColorOptionRow(row) : null;
  } finally {
    client.release();
  }
};

export const clientReferenceRepo = {
  loadCities: async (): Promise<CitiesResponse> => {
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
  },

  loadHairColors: (): Promise<string[]> => loadActiveColors("hair_color"),

  loadAdminHairColors: (): Promise<HairColor[]> =>
    loadAdminColors("hair_color") as Promise<HairColor[]>,

  addHairColor: (color: string): Promise<string | null> =>
    addColor("hair_color", color),

  deactivateHairColor: (color: string): Promise<HairColor | null> =>
    setColorActive("hair_color", color, false) as Promise<HairColor | null>,

  activateHairColor: (color: string): Promise<HairColor | null> =>
    setColorActive("hair_color", color, true) as Promise<HairColor | null>,

  loadEyeColors: (): Promise<string[]> => loadActiveColors("eye_color"),

  loadAdminEyeColors: (): Promise<EyeColor[]> =>
    loadAdminColors("eye_color") as Promise<EyeColor[]>,

  addEyeColor: (color: string): Promise<string | null> =>
    addColor("eye_color", color),

  deactivateEyeColor: (color: string): Promise<EyeColor | null> =>
    setColorActive("eye_color", color, false) as Promise<EyeColor | null>,

  activateEyeColor: (color: string): Promise<EyeColor | null> =>
    setColorActive("eye_color", color, true) as Promise<EyeColor | null>,

  loadIdTypes: async (): Promise<string[]> => {
    const client = await connect();
    const query = "SELECT type FROM id_type ORDER BY type ASC";

    try {
      const result = await client.query(query);
      return result.rows.map((row) => row.type);
    } finally {
      client.release();
    }
  },
};
