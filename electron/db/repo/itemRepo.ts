import { connect } from "../table/createTable.ts";
import type { Item, ItemTicketStatus } from "../../../shared/types/Item.ts";

const mapItemRow = (row: Record<string, unknown>): Item => {
  return {
    item_number: Number(row.item_number),
    quantity: Number(row.quantity ?? 0),
    description: row.description ? String(row.description) : "",
    brand_name: row.brand_name ? String(row.brand_name) : "",
    model_number: row.model_number ? String(row.model_number) : "",
    serial_number: row.serial_number ? String(row.serial_number) : "",
    amount: Number(row.amount ?? 0),
    item_ticket_status: Array.isArray(row.item_ticket_status)
      ? (row.item_ticket_status as ItemTicketStatus[])
      : [],
    image_path: row.image_path ? String(row.image_path) : "",
  };
};

export const itemRepo = {
  getItems: async (ticketNumber: number): Promise<Item[]> => {
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
        item_ticket_status,
        image_path
      FROM item
      WHERE EXISTS (
        SELECT 1
        FROM jsonb_array_elements(item_ticket_status) AS status_entry
        WHERE (status_entry ->> 'ticket_number')::integer = $1
      )
      ORDER BY item_number DESC
    `;

    try {
      const result = await client.query(query, [ticketNumber]);
      return result.rows.map(mapItemRow);
    } finally {
      client.release();
    }
  },
};
