import { connect } from "../../db/connection.ts";
import type { DbClient } from "../../db/connection.ts";
import type {
  ItemCategoryOption,
  SaveItemInput,
} from "../../shared/types/itemPayload.ts";
import type { Item } from "../../shared/types/Item.ts";
import type { Ticket } from "../../shared/types/Ticket.ts";

const mapItemRow = (row: Record<string, unknown>): Item => {
  const latestTicketStatus = row.latest_ticket_status
    ? (String(row.latest_ticket_status) as Ticket["status"])
    : undefined;

  return {
    item_number: Number(row.item_number),
    quantity: Number(row.quantity ?? 0),
    subcategory_id: row.subcategory_id ? Number(row.subcategory_id) : undefined,
    category_name: row.category_name ? String(row.category_name) : "",
    subcategory_name: row.subcategory_name ? String(row.subcategory_name) : "",
    description: row.description ? String(row.description) : "",
    brand_name: row.brand_name ? String(row.brand_name) : "",
    model_number: row.model_number ? String(row.model_number) : "",
    serial_number: row.serial_number ? String(row.serial_number) : "",
    amount: Number(row.amount ?? 0),
    latest_ticket_number: row.latest_ticket_number
      ? Number(row.latest_ticket_number)
      : undefined,
    latest_ticket_status: latestTicketStatus,
    is_loadable: latestTicketStatus ? latestTicketStatus !== "pawned" : true,
    image_path: row.image_path ? String(row.image_path) : "",
  };
};

export const itemRepo = {
  loadCategories: async (): Promise<ItemCategoryOption[]> => {
    const client = await connect();
    const query = `
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        s.id AS subcategory_id,
        s.name AS subcategory_name
      FROM item_subcategory s
      INNER JOIN item_category c
        ON c.id = s.category_id
      WHERE c.is_active = TRUE
        AND s.is_active = TRUE
      ORDER BY c.name ASC, s.name ASC
    `;

    try {
      const result = await client.query(query);
      return result.rows.map((row) => ({
        category_id: Number(row.category_id),
        category_name: String(row.category_name),
        subcategory_id: Number(row.subcategory_id),
        subcategory_name: String(row.subcategory_name),
      }));
    } finally {
      client.release();
    }
  },

  loadByTicketNumber: async (ticketNumber: number): Promise<Item[]> => {
    const client = await connect();
    const query = `
      SELECT
        i.item_number,
        i.quantity,
        i.subcategory_id,
        c.name AS category_name,
        s.name AS subcategory_name,
        i.description,
        i.brand_name,
        i.model_number,
        i.serial_number,
        i.amount,
        i.latest_ticket_number,
        latest_ticket.status AS latest_ticket_status,
        i.image_path
      FROM item i
      LEFT JOIN ticket_item ti
        ON ti.item_number = i.item_number
       AND ti.ticket_number = $1
      LEFT JOIN ticket source_ticket
        ON source_ticket.ticket_number = $1
      LEFT JOIN ticket latest_ticket
        ON latest_ticket.ticket_number = i.latest_ticket_number
      LEFT JOIN item_subcategory s
        ON s.id = i.subcategory_id
      LEFT JOIN item_category c
        ON c.id = s.category_id
      WHERE ti.ticket_number IS NOT NULL
         OR i.item_number = ANY(COALESCE(source_ticket.items, '{}'))
      ORDER BY i.item_number DESC
    `;

    try {
      const result = await client.query(query, [ticketNumber]);
      return result.rows.map(mapItemRow);
    } finally {
      client.release();
    }
  },

  loadByItemNumber: async (
    itemNumber: number,
    dbClient: DbClient,
  ): Promise<Item | null> => {
    const query = `
      SELECT
        i.item_number,
        i.quantity,
        i.subcategory_id,
        c.name AS category_name,
        s.name AS subcategory_name,
        i.description,
        i.brand_name,
        i.model_number,
        i.serial_number,
        i.amount,
        i.latest_ticket_number,
        latest_ticket.status AS latest_ticket_status,
        i.image_path
      FROM item i
      LEFT JOIN ticket latest_ticket
        ON latest_ticket.ticket_number = i.latest_ticket_number
      LEFT JOIN item_subcategory s
        ON s.id = i.subcategory_id
      LEFT JOIN item_category c
        ON c.id = s.category_id
      WHERE i.item_number = $1
      LIMIT 1
    `;

    const result = await dbClient.query(query, [itemNumber]);
    return result.rows[0] ? mapItemRow(result.rows[0]) : null;
  },

  assertItemCanBeLoaded: async (
    itemNumber: number,
    targetTicketNumber: number,
    dbClient: DbClient,
  ): Promise<void> => {
    const result = await dbClient.query(
      `
        SELECT
          i.item_number,
          i.latest_ticket_number,
          latest_ticket.status AS latest_ticket_status
        FROM item i
        LEFT JOIN ticket latest_ticket
          ON latest_ticket.ticket_number = i.latest_ticket_number
        WHERE i.item_number = $1
        LIMIT 1
      `,
      [itemNumber],
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error(`Item #${itemNumber} was not found.`);
    }

    const latestTicketNumber = row.latest_ticket_number
      ? Number(row.latest_ticket_number)
      : undefined;
    const latestTicketStatus = row.latest_ticket_status
      ? String(row.latest_ticket_status)
      : "";

    if (
      latestTicketStatus === "pawned" &&
      latestTicketNumber !== targetTicketNumber
    ) {
      throw new Error(
        `Item #${itemNumber} is already active on pawn ticket #${latestTicketNumber}.`,
      );
    }
  },

  linkItemToTicket: async (
    ticketNumber: number,
    itemNumber: number,
    dbClient: DbClient,
  ): Promise<Item> => {
    await itemRepo.assertItemCanBeLoaded(itemNumber, ticketNumber, dbClient);

    await dbClient.query(
      `
        INSERT INTO ticket_item (ticket_number, item_number)
        VALUES ($1, $2)
        ON CONFLICT (ticket_number, item_number) DO NOTHING
      `,
      [ticketNumber, itemNumber],
    );

    await dbClient.query(
      `
        UPDATE ticket
        SET items = CASE
          WHEN $2 = ANY(items) THEN items
          ELSE array_append(items, $2)
        END
        WHERE ticket_number = $1
      `,
      [ticketNumber, itemNumber],
    );

    await dbClient.query(
      `
        UPDATE item
        SET latest_ticket_number = $1
        WHERE item_number = $2
      `,
      [ticketNumber, itemNumber],
    );

    const item = await itemRepo.loadByItemNumber(itemNumber, dbClient);

    if (!item) {
      throw new Error(`Item #${itemNumber} was not found after linking.`);
    }

    return item;
  },

  create: async (
    payload: SaveItemInput,
    dbClient: DbClient,
  ): Promise<Item> => {
    const query = `
      INSERT INTO item (
        quantity,
        subcategory_id,
        description,
        brand_name,
        model_number,
        serial_number,
        amount,
        latest_ticket_number,
        image_path
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING
        item_number,
        quantity,
        subcategory_id,
        description,
        brand_name,
        model_number,
        serial_number,
        amount,
        latest_ticket_number,
        image_path
    `;

    const result = await dbClient.query(query, [
      payload.quantity,
      payload.subcategory_id,
      payload.description,
      payload.brand_name,
      payload.model_number,
      payload.serial_number,
      payload.amount,
      payload.ticket_number,
      payload.image_path ?? "",
    ]);

    const item = mapItemRow(result.rows[0]);

    await dbClient.query(
      `
        INSERT INTO ticket_item (ticket_number, item_number)
        VALUES ($1, $2)
        ON CONFLICT (ticket_number, item_number) DO NOTHING
      `,
      [payload.ticket_number, item.item_number],
    );

    await dbClient.query(
      `
        UPDATE ticket
        SET items = CASE
          WHEN $2 = ANY(items) THEN items
          ELSE array_append(items, $2)
        END
        WHERE ticket_number = $1
      `,
      [payload.ticket_number, item.item_number],
    );

    return item;
  },

  update: async (
    payload: SaveItemInput,
    dbClient: DbClient,
  ): Promise<Item> => {
    const query = `
      UPDATE item
      SET
        quantity = $1,
        subcategory_id = $2,
        description = $3,
        brand_name = $4,
        model_number = $5,
        serial_number = $6,
        amount = $7,
        latest_ticket_number = $8,
        image_path = $9
      WHERE item_number = $10
      RETURNING
        item_number,
        quantity,
        subcategory_id,
        description,
        brand_name,
        model_number,
        serial_number,
        amount,
        latest_ticket_number,
        image_path
    `;

    const result = await dbClient.query(query, [
      payload.quantity,
      payload.subcategory_id,
      payload.description,
      payload.brand_name,
      payload.model_number,
      payload.serial_number,
      payload.amount,
      payload.ticket_number,
      payload.image_path ?? "",
      payload.item_number,
    ]);

    if (!result.rows[0]) {
      throw new Error(`[itemRepo] update(): Item #${payload.item_number} not found`);
    }

    return mapItemRow(result.rows[0]);
  },

  updateImagePath: async (
    itemNumber: number,
    imagePath: string,
    dbClient: DbClient,
  ): Promise<void> => {
    await dbClient.query(
      `
        UPDATE item
        SET image_path = $1
        WHERE item_number = $2
      `,
      [imagePath, itemNumber],
    );
  },

  delete: async (
    ticketNumber: number,
    itemNumber: number,
    dbClient: DbClient,
  ): Promise<void> => {
    await dbClient.query(
      `
        UPDATE ticket
        SET items = array_remove(items, $2)
        WHERE ticket_number = $1
      `,
      [ticketNumber, itemNumber],
    );

    await dbClient.query(
      `
        DELETE FROM ticket_item
        WHERE ticket_number = $1
          AND item_number = $2
      `,
      [ticketNumber, itemNumber],
    );

    await dbClient.query(
      `
        DELETE FROM item
        WHERE item_number = $1
      `,
      [itemNumber],
    );
  },
};
