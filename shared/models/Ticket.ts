export interface Ticket {
    ticket_number: number;
    pawn_datetime: Date;
    due_date: Date;
    pickup_datetime?: Date;
    location: string;
    description: string;
    pawn_price: number;
    interest: number;
    pickup_price: number;
    status: 'pawned' | 'picked_up' | 'expired';
    employee_id?: number;
    customer_number?: number;
    last_payment_date?: Date;
}