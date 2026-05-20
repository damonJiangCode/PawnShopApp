export interface Ticket {
  ticket_number?: number;
  transaction_datetime: Date;
  is_lost: boolean;
  location: string;
  description: string;
  due_date: Date;
  is_overdue: boolean;
  amount: number;
  onetime_fee: number;
  interest: number;
  interest_paid_months: number;
  pickup_amount: number;
  interested_datetime?: Date;
  employee_name: string;
  pickup_datetime?: Date;
  expire_date?: Date;
  status: "pawned" | "pawn_expired" | "picked_up" | "sold" | "sell_expired";
  status_updated_at: Date;
  client_number: number;
  items?: number[];
}
