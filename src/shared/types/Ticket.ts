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
  pickup_amount: number;
  interested_datetime?: Date;
  employee_name: string;
  pickup_datetime?: Date;
  status: "pawned" | "picked_up" | "expired" | "sold";
  client_number: number;
  items?: number[];
}
