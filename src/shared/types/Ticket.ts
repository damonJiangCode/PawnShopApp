export interface Ticket {
  ticket_number?: number;
  transaction_datetime: Date;
  is_lost: boolean;
  is_stolen: boolean;
  location: string;
  description: string;
  due_date: Date;
  amount: number;
  onetime_fee: number;
  interest_paid_months: number;
  partial_payment: number;
  partial_payment_datetime?: Date;
  interested_datetime?: Date;
  employee_name: string;
  pickup_datetime?: Date;
  pickup_amount_paid?: number;
  expire_date?: Date;
  status: "pawned" | "pawn_expired" | "picked_up" | "sell" | "sell_expired";
  status_updated_at: Date;
  client_number: number;
}
