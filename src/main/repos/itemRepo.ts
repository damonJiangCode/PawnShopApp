import { connect } from "../../db/connection.ts";
import type { Item } from "../../shared/types/Item.ts";

const mapItemRow = (row: Record<string, unknown>): Item => {
  return {
    item_number: Number(row.item_number),
    quantity: Number(row.quantity ?? 0),
    description: row.description ? String(row.description) : "",
    brand_name: row.brand_name ? String(row.brand_name) : "",
    model_number: row.model_number ? String(row.model_number) : "",
    serial_number: row.serial_number ? String(row.serial_number) : "",
    amount: Number(row.amount ?? 0),
    latest_ticket_number: row.latest_ticket_number
      ? Number(row.latest_ticket_number)
      : undefined,
    image_path: row.image_path ? String(row.image_path) : "",
  };
};

export const itemRepo = {
  loadByTicketNumber: async (ticketNumber: number): Promise<Item[]> => {
    const client = await connect();
    const query = `
      SELECT
        item_number,
        quantity,
        description,
        brand_name,
        model_number,
        serial_number,
        amount,
        latest_ticket_number,
        image_path
      FROM item i
      INNER JOIN ticket t
        ON i.item_number = ANY(t.items)
      WHERE t.ticket_number = $1
      ORDER BY i.item_number DESC
    `;

    try {
      const result = await client.query(query, [ticketNumber]);
      return result.rows.map(mapItemRow);
    } finally {
      client.release();
    }
  },
};
