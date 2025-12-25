export interface Ticket {
  ticket_number: number;
  transaction_datetime: Date;
  location: string;
  description: string;
  due_date: Date;
  amount: number;
  interest: number;
  pickup_amount: number;
  interested_datetime?: Date;
  employee_name: string;
  pickup_datetime?: Date;
  status: "pawned" | "picked_up" | "expired";
  customer_number: number;
}
