import { connect } from "../../database/connection.ts";
import type { DbClient } from "../../database/connection.ts";
import type {
  ItemCategoryOption,
  ItemSearchInput,
  ItemSearchResult,
  SaveItemInput,
} from "../../../shared/payload-contracts/item.contract.ts";
import type { Item } from "../../../shared/models/item.model.ts";
import type { Ticket } from "../../../shared/models/ticket.model.ts";
import { createFieldError } from "../../shared/createFieldError.ts";

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
    is_loadable: latestTicketStatus
      ? latestTicketStatus !== "pawned" && latestTicketStatus !== "sold"
      : true,
    image_path: row.image_path ? String(row.image_path) : "",
  };
};

const itemSelectColumns = `
  iws.item_number,
  iws.quantity,
  iws.subcategory_id,
  iws.category_name,
  iws.subcategory_name,
  iws.description,
  iws.brand_name,
  iws.model_number,
  iws.serial_number,
  iws.amount,
  iws.latest_ticket_number,
  iws.latest_ticket_status,
  iws.image_path
`;

const mapItemCategoryRow = (
  row: Record<string, unknown>,
): ItemCategoryOption => ({
  category_id: Number(row.category_id),
  category_name: String(row.category_name),
  subcategory_id: Number(row.subcategory_id),
  subcategory_name: String(row.subcategory_name),
});

const itemSnapshotSql = (itemAlias: string) => `
  jsonb_build_object(
    'item_number', ${itemAlias}.item_number,
    'quantity', ${itemAlias}.quantity,
    'subcategory_id', ${itemAlias}.subcategory_id,
    'category_name', COALESCE(ic.name, ''),
    'subcategory_name', COALESCE(isc.name, ''),
    'description', ${itemAlias}.description,
    'brand_name', COALESCE(${itemAlias}.brand_name, ''),
    'model_number', COALESCE(${itemAlias}.model_number, ''),
    'serial_number', COALESCE(${itemAlias}.serial_number, ''),
    'amount', ${itemAlias}.amount,
    'image_path', ${itemAlias}.image_path
  )
`;

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
      return result.rows.map(mapItemCategoryRow);
    } finally {
      client.release();
    }
  },

  loadByTicketNumber: async (ticketNumber: number): Promise<Item[]> => {
    const client = await connect();
    const query = `
      SELECT ${itemSelectColumns}
      FROM item_with_status iws
      INNER JOIN ticket_item ti
        ON ti.item_number = iws.item_number
       AND ti.ticket_number = $1
      WHERE ti.ticket_number = $1
      ORDER BY iws.item_number DESC
    `;

    try {
      const result = await client.query(query, [ticketNumber]);
      return result.rows.map(mapItemRow);
    } finally {
      client.release();
    }
  },

  loadPawnHistoryByClientNumber: async (
    clientNumber: number,
  ): Promise<Item[]> => {
    const client = await connect();
    const query = `
      SELECT
        ${itemSelectColumns},
        EXISTS (
          SELECT 1
          FROM ticket_item current_ti
          INNER JOIN ticket current_t
            ON current_t.ticket_number = current_ti.ticket_number
          WHERE current_ti.item_number = iws.item_number
            AND current_t.client_number = $1
            AND current_t.status = 'pawned'
        ) AS is_currently_pawned
      FROM item_with_status iws
      WHERE EXISTS (
        SELECT 1
        FROM ticket_item history_ti
        INNER JOIN ticket history_t
          ON history_t.ticket_number = history_ti.ticket_number
        WHERE history_ti.item_number = iws.item_number
          AND history_t.client_number = $1
          AND history_t.status IN (
            'pawned',
            'pawned_picked_up',
            'pawned_expired'
          )
      )
      ORDER BY is_currently_pawned DESC, iws.item_number DESC
    `;

    try {
      const result = await client.query(query, [clientNumber]);
      return result.rows.map((row) => ({
        ...mapItemRow(row),
        is_currently_pawned: Boolean(row.is_currently_pawned),
      }));
    } finally {
      client.release();
    }
  },

  loadByItemNumber: async (
    itemNumber: number,
    dbClient: DbClient,
  ): Promise<Item | null> => {
    const query = `
      SELECT ${itemSelectColumns}
      FROM item_with_status iws
      WHERE iws.item_number = $1
      LIMIT 1
    `;

    const result = await dbClient.query(query, [itemNumber]);
    return result.rows[0] ? mapItemRow(result.rows[0]) : null;
  },

  search: async (payload: ItemSearchInput): Promise<ItemSearchResult> => {
    const resultLimit = 500;
    const conditions: string[] = [];
    const values: Array<number | string> = [];

    if (payload.item_number) {
      values.push(payload.item_number);
      conditions.push(`iws.item_number = $${values.length}`);
    } else {
      const categoryId = payload.category_id;
      const subcategoryId = payload.subcategory_id;
      const brandName = payload.brand_name?.trim();
      const modelNumber = payload.model_number?.trim();
      const serialNumber = payload.serial_number?.trim();

      if (categoryId) {
        values.push(categoryId);
        conditions.push(
          `iws.category_name = (SELECT name FROM item_category WHERE id = $${values.length})`,
        );
      }

      if (subcategoryId) {
        values.push(subcategoryId);
        conditions.push(`iws.subcategory_id = $${values.length}`);
      }

      if (brandName) {
        values.push(`%${brandName}%`);
        conditions.push(`iws.brand_name ILIKE $${values.length}`);
      }

      if (modelNumber) {
        values.push(`%${modelNumber}%`);
        conditions.push(`iws.model_number ILIKE $${values.length}`);
      }

      if (serialNumber) {
        values.push(`%${serialNumber}%`);
        conditions.push(`iws.serial_number ILIKE $${values.length}`);
      }
    }

    if (!conditions.length) {
      return { items: [], limit: resultLimit, limit_reached: false };
    }

    const client = await connect();
    const query = `
      SELECT ${itemSelectColumns}
      FROM item_with_status iws
      WHERE ${conditions.join(" AND ")}
      ORDER BY iws.item_number DESC
      LIMIT ${resultLimit + 1}
    `;

    try {
      const result = await client.query(query, values);
      return {
        items: result.rows.slice(0, resultLimit).map(mapItemRow),
        limit: resultLimit,
        limit_reached: result.rows.length > resultLimit,
      };
    } finally {
      client.release();
    }
  },

  assertItemCanBeLoaded: async (
    itemNumber: number,
    targetTicketNumber: number,
    dbClient: DbClient,
  ): Promise<void> => {
    await dbClient.query("SELECT pg_advisory_xact_lock(198511, $1)", [
      itemNumber,
    ]);

    const result = await dbClient.query(
      `
        SELECT
          item_number,
          latest_ticket_number,
          latest_ticket_status
        FROM item_with_status
        WHERE item_number = $1
        LIMIT 1
      `,
      [itemNumber],
    );

    const row = result.rows[0];

    if (!row) {
      throw createFieldError(
        "item_number",
        `Item #${itemNumber} was not found.`,
      );
    }

    const latestTicketNumber = row.latest_ticket_number
      ? Number(row.latest_ticket_number)
      : undefined;
    const latestTicketStatus = row.latest_ticket_status
      ? String(row.latest_ticket_status)
      : "";

    if (
      (latestTicketStatus === "pawned" || latestTicketStatus === "sold") &&
      latestTicketNumber !== targetTicketNumber
    ) {
      throw createFieldError(
        "item_number",
        `Item #${itemNumber} is already active on ticket #${latestTicketNumber}.`,
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
        INSERT INTO ticket_item (ticket_number, item_number, item_snapshot)
        SELECT $1, i.item_number, ${itemSnapshotSql("i")}
        FROM item i
        LEFT JOIN item_subcategory isc ON isc.id = i.subcategory_id
        LEFT JOIN item_category ic ON ic.id = isc.category_id
        WHERE i.item_number = $2
        ON CONFLICT (ticket_number, item_number) DO NOTHING
      `,
      [ticketNumber, itemNumber],
    );

    const item = await itemRepo.loadByItemNumber(itemNumber, dbClient);

    if (!item) {
      throw new Error(`Item #${itemNumber} was not found after linking.`);
    }

    return item;
  },

  create: async (payload: SaveItemInput, dbClient: DbClient): Promise<Item> => {
    const query = `
      INSERT INTO item (
        quantity,
        subcategory_id,
        description,
        brand_name,
        model_number,
        serial_number,
        amount,
        image_path
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING item_number
    `;

    const result = await dbClient.query(query, [
      payload.quantity,
      payload.subcategory_id,
      payload.description,
      payload.brand_name,
      payload.model_number,
      payload.serial_number,
      payload.amount,
      payload.image_path ?? "",
    ]);

    const itemNumber = Number(result.rows[0].item_number);

    await dbClient.query(
      `
        INSERT INTO ticket_item (ticket_number, item_number, item_snapshot)
        SELECT $1, i.item_number, ${itemSnapshotSql("i")}
        FROM item i
        LEFT JOIN item_subcategory isc ON isc.id = i.subcategory_id
        LEFT JOIN item_category ic ON ic.id = isc.category_id
        WHERE i.item_number = $2
        ON CONFLICT (ticket_number, item_number) DO NOTHING
      `,
      [payload.ticket_number, itemNumber],
    );

    const item = await itemRepo.loadByItemNumber(itemNumber, dbClient);

    if (!item) {
      throw new Error(`Item #${itemNumber} was not found after creating.`);
    }

    return item;
  },

  update: async (payload: SaveItemInput, dbClient: DbClient): Promise<Item> => {
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
        image_path = $8
      WHERE item_number = $9
      RETURNING item_number
    `;

    const result = await dbClient.query(query, [
      payload.quantity,
      payload.subcategory_id,
      payload.description,
      payload.brand_name,
      payload.model_number,
      payload.serial_number,
      payload.amount,
      payload.image_path ?? "",
      payload.item_number,
    ]);

    if (!result.rows[0]) {
      throw new Error(
        `[itemRepo] update(): Item #${payload.item_number} not found`,
      );
    }

    await dbClient.query(
      `
        UPDATE ticket_item ti
        SET item_snapshot = ${itemSnapshotSql("i")}
        FROM item i
        LEFT JOIN item_subcategory isc ON isc.id = i.subcategory_id
        LEFT JOIN item_category ic ON ic.id = isc.category_id
        WHERE ti.ticket_number = $1
          AND ti.item_number = $2
          AND i.item_number = ti.item_number
      `,
      [payload.ticket_number, payload.item_number],
    );

    const item = await itemRepo.loadByItemNumber(
      Number(result.rows[0].item_number),
      dbClient,
    );

    if (!item) {
      throw new Error(
        `[itemRepo] update(): Item #${payload.item_number} not found after update`,
      );
    }

    return item;
  },

  updateImagePath: async (
    itemNumber: number,
    imagePath: string,
    ticketNumber: number,
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
    await dbClient.query(
      `
        UPDATE ticket_item
        SET item_snapshot = jsonb_set(
          item_snapshot,
          '{image_path}',
          to_jsonb($1::text),
          TRUE
        )
        WHERE ticket_number = $2
          AND item_number = $3
      `,
      [imagePath, ticketNumber, itemNumber],
    );
  },

  delete: async (
    ticketNumber: number,
    itemNumber: number,
    dbClient: DbClient,
  ): Promise<void> => {
    await dbClient.query(
      `
        DELETE FROM ticket_item
        WHERE ticket_number = $1
          AND item_number = $2
      `,
      [ticketNumber, itemNumber],
    );
  },
};
