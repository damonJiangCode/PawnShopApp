import React from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
} from "@mui/material";
import { Ticket } from "../../../shared/models/Ticket";

const headers = [
    { id: "ticket_number", label: "Ticket #" },
    { id: "pawn_datetime", label: "Date" },
    { id: "location", label: "Location" },
    { id: "description", label: "Item" },
    { id: "due_date", label: "Due Date" },
    { id: "pawn_price", label: "Pawn $" },
    { id: "interest", label: "Interest $" },
    { id: "pickup_price", label: "Pickup $" },
    { id: "employee_id", label: "Employee" },
    { id: "last_payment_date", label: "Payment Date" },
    // 你可以在这里继续添加更多列
];

const rows: Ticket[] = [
    {
        ticket_number: 1,
        pawn_datetime: new Date("2025-09-01"),
        due_date: new Date("2025-10-01"),
        pickup_datetime: undefined,
        location: "RR T",
        description: "Gold Ring",
        pawn_price: 501,
        interest: 50,
        pickup_price: 551,
        status: "pawned",
        employee_id: 101,
        customer_number: 1001,
    },
    {
        ticket_number: 2,
        pawn_datetime: new Date("2025-09-02"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AB12",
        description: "Silver Necklace",
        pawn_price: 301,
        interest: 30,
        pickup_price: 331,
        status: "picked_up",
        employee_id: 102,
        customer_number: 1002,
    },
    {
        ticket_number: 3,
        pawn_datetime: new Date("2025-08-02"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AC12",
        description: "Nailer",
        pawn_price: 31,
        interest: 3,
        pickup_price: 34,
        status: "pawned",
        employee_id: 102,
        customer_number: 1003,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },
    {
        ticket_number: 5,
        pawn_datetime: new Date("2025-08-22"),
        due_date: new Date("2025-10-02"),
        pickup_datetime: new Date("2025-09-12"),
        location: "AA12",
        description: "speaker",
        pawn_price: 21,
        interest: 5,
        pickup_price: 26,
        status: "pawned",
        employee_id: 102,
        customer_number: 1010,
    },

    // 可以添加更多数据
];

const formatDate = (date?: Date) =>
    date ? date.toISOString().split("T")[0] : "";

const TicketTable: React.FC = () => {
    return (
        <TableContainer
            sx={{
                height: 300,
                width: "100%",
                overflowY: "scroll",
                overflowX: "scroll",
                border: "2px solid #ccc",
                borderRadius: "8px",
            }}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {headers.map((col) => (
                            <TableCell
                                key={col.id}
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    minWidth: 80,
                                    maxWidth: 120,
                                    padding: "6px 8px",
                                    fontWeight: 600,
                                    borderRight: "1px solid #eee",
                                    backgroundColor: "#e0e7ef",
                                    borderBottom: "2px solid #b0b8c1",

                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, idx) => (
                        <TableRow key={idx}>
                            {headers.map((col) => (
                                <TableCell
                                    key={col.id}
                                    sx={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        minWidth: 80,
                                        maxWidth: 120,
                                        padding: "6px 8px",
                                        borderRight: "1px solid #eee",
                                    }}
                                    title={
                                        typeof row[col.id as keyof Ticket] === "string"
                                            ? (row[col.id as keyof Ticket] as string)
                                            : undefined
                                    }
                                >
                                    {col.id.includes("date")
                                        ? formatDate(row[col.id as keyof Ticket] as Date | undefined)
                                        : row[col.id as keyof Ticket]?.toString()}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TicketTable;