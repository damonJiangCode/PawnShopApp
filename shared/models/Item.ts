export interface Item {
  item_number: number;
  quantity: number;
  description: string;
  brand_name?: string;
  model_number?: string;
  serial_number?: string;
  pawn_price: number;
  ticket_number: number;
  customer_number: number;
}
