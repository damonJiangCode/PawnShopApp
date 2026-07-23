import type { Client } from "../../../shared/types/Client.ts";

export const mapRowToClient = (row: Record<string, unknown>): Client => ({
  client_number: Number(row.client_number),
  first_name: String(row.first_name ?? ""),
  last_name: String(row.last_name ?? ""),
  middle_name: String(row.middle_name ?? ""),
  date_of_birth: row.date_of_birth as Date,
  gender: String(row.gender ?? ""),
  hair_color: row.hair_color ? String(row.hair_color).toUpperCase() : "",
  eye_color: row.eye_color ? String(row.eye_color).toUpperCase() : "",
  height_cm: row.height_cm === null ? undefined : Number(row.height_cm),
  weight_kg: row.weight_kg === null ? undefined : Number(row.weight_kg),
  address: String(row.address ?? ""),
  postal_code: String(row.postal_code ?? ""),
  city: String(row.city ?? ""),
  province: String(row.province ?? ""),
  country: String(row.country ?? ""),
  email: String(row.email ?? ""),
  phone: String(row.phone ?? ""),
  notes: String(row.notes ?? ""),
  image_path: String(row.image_path ?? ""),
  image_updated_at: row.image_updated_at
    ? (row.image_updated_at as Date)
    : null,
  pickup_self_only: Boolean(row.pickup_self_only),
  updated_at: row.updated_at as Date,
  redeem_count: Number(row.redeem_count ?? 0),
  sell_count: Number(row.sell_count ?? 0),
  expire_count: Number(row.expire_count ?? 0),
  overdue_count: Number(row.overdue_count ?? 0),
  identifications: (row.identifications ?? []) as Client["identifications"],
});

export const clientWithIdentificationsFromClause = `
  SELECT
    c.*,
    COALESCE(ci.identifications, '[]') AS identifications
  FROM client c
  LEFT JOIN LATERAL (
    SELECT json_agg(
      jsonb_build_object(
        'id', client_id.id,
        'id_type', client_id.id_type,
        'id_value', client_id.id_value,
        'updated_at', client_id.updated_at
      )
      ORDER BY client_id.id
    ) AS identifications
    FROM client_id
    WHERE client_id.client_number = c.client_number
  ) ci ON TRUE
`;
