export interface ItemTicketStatus {
  ticket_number: number;
  status: "pawned" | "picked_up" | "expired";
}

export interface Item {
  item_number: number;
  quantity: number;
  description: string;
  brand_name?: string;
  model_number?: string;
  serial_number?: string;
  amount: number;
  item_ticket_status: ItemTicketStatus[];
  image_path?: string;
}
