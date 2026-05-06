export const createTicketItemTable = `
  CREATE TABLE IF NOT EXISTS ticket_item (
    ticket_number INTEGER NOT NULL REFERENCES ticket(ticket_number) ON DELETE CASCADE,
    item_number INTEGER NOT NULL REFERENCES item(item_number) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (ticket_number, item_number)
  );
`;

export const createTicketItemIndexes = `
  CREATE INDEX IF NOT EXISTS idx_ticket_item_item_number
  ON ticket_item(item_number);

  CREATE INDEX IF NOT EXISTS idx_ticket_item_ticket_number
  ON ticket_item(ticket_number);
`;

export const createItemWithStatusView = `
  CREATE OR REPLACE VIEW item_with_status AS
  SELECT
    i.item_number,
    i.quantity,
    i.subcategory_id,
    i.description,
    i.brand_name,
    i.model_number,
    i.serial_number,
    i.amount,
    i.latest_ticket_number,
    t.status AS latest_ticket_status,
    i.image_path
  FROM item i
  LEFT JOIN ticket t
    ON t.ticket_number = i.latest_ticket_number;
`;

export const createTicketItemGuards = `
  CREATE OR REPLACE FUNCTION prevent_item_multiple_pawned_tickets()
  RETURNS trigger AS $$
  DECLARE
    target_ticket_status TEXT;
    conflicting_ticket_number INTEGER;
  BEGIN
    SELECT status
    INTO target_ticket_status
    FROM ticket
    WHERE ticket_number = NEW.ticket_number;

    IF target_ticket_status = 'pawned' THEN
      SELECT ti.ticket_number
      INTO conflicting_ticket_number
      FROM ticket_item ti
      INNER JOIN ticket t
        ON t.ticket_number = ti.ticket_number
      WHERE ti.item_number = NEW.item_number
        AND ti.ticket_number <> NEW.ticket_number
        AND t.status = 'pawned'
      LIMIT 1;

      IF conflicting_ticket_number IS NOT NULL THEN
        RAISE EXCEPTION
          'Item % is already active on pawn ticket %',
          NEW.item_number,
          conflicting_ticket_number;
      END IF;
    END IF;

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS trg_prevent_item_multiple_pawned_tickets
  ON ticket_item;

  CREATE TRIGGER trg_prevent_item_multiple_pawned_tickets
  BEFORE INSERT OR UPDATE ON ticket_item
  FOR EACH ROW
  EXECUTE FUNCTION prevent_item_multiple_pawned_tickets();

  CREATE OR REPLACE FUNCTION prevent_ticket_with_conflicting_pawned_items()
  RETURNS trigger AS $$
  DECLARE
    conflicting_item_number INTEGER;
    conflicting_ticket_number INTEGER;
  BEGIN
    IF NEW.status = 'pawned' THEN
      SELECT current_items.item_number, other_ti.ticket_number
      INTO conflicting_item_number, conflicting_ticket_number
      FROM ticket_item current_items
      INNER JOIN ticket_item other_ti
        ON other_ti.item_number = current_items.item_number
       AND other_ti.ticket_number <> NEW.ticket_number
      INNER JOIN ticket other_ticket
        ON other_ticket.ticket_number = other_ti.ticket_number
      WHERE current_items.ticket_number = NEW.ticket_number
        AND other_ticket.status = 'pawned'
      LIMIT 1;

      IF conflicting_item_number IS NOT NULL THEN
        RAISE EXCEPTION
          'Item % is already active on pawn ticket %',
          conflicting_item_number,
          conflicting_ticket_number;
      END IF;
    END IF;

    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS trg_prevent_ticket_with_conflicting_pawned_items
  ON ticket;

  CREATE TRIGGER trg_prevent_ticket_with_conflicting_pawned_items
  BEFORE UPDATE OF status ON ticket
  FOR EACH ROW
  EXECUTE FUNCTION prevent_ticket_with_conflicting_pawned_items();
`;
