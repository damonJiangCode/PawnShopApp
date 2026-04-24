export interface Item {
  item_number: number;
  source_item_number?: number;
  quantity: number;
  description: string;
  brand_name?: string;
  model_number?: string;
  serial_number?: string;
  amount: number;
  latest_ticket_number?: number;
  image_path?: string;
  draft_id?: string;
  is_loaded_draft?: boolean;
}
