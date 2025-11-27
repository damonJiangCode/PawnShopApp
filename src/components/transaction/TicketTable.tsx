// import React from "react";
// import { Ticket } from "../../../shared/models/Ticket";
// import {
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Typography,
//   Paper,
// } from "@mui/material";

// export interface TicketTableProps {
//   tickets: Ticket[];
//   selectedTicketId?: number | null;
//   onSelect: (id: number | string) => void;
// }

// const TicketTable: React.FC<TicketTableProps> = (props) => {
//   const { tickets, selectedTicketId, onSelect } = props;
//   const format = (date?: Date) =>
//     date ? date.toISOString().split("T")[0] : "-";

//   return (
//     <TableContainer
//       component={Paper}
//       sx={{
//         maxHeight: 400, // 固定高度（可改）
//         maxWidth: "100%",
//         overflow: "auto", // 横向 + 纵向滚动
//         border: "1px solid #ddd",
//       }}
//     >
//       <Table stickyHeader size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell>Ticket #</TableCell>
//             <TableCell>Pawn Date</TableCell>
//             <TableCell>Due Date</TableCell>
//             <TableCell>Pickup Date</TableCell>
//             <TableCell>Location</TableCell>
//             <TableCell>Description</TableCell>
//             <TableCell>Pawn $</TableCell>
//             <TableCell>Interest</TableCell>
//             <TableCell>Pickup $</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Employee</TableCell>
//             <TableCell>Customer #</TableCell>
//             <TableCell>Last Payment</TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {tickets.map((t) => {
//             const isSelected =
//               String(t.ticket_number) === String(selectedTicketId);

//             return (
//               <TableRow
//                 hover
//                 key={t.ticket_number}
//                 selected={isSelected}
//                 onClick={() => onSelect(t.ticket_number)}
//                 sx={{
//                   cursor: "pointer",
//                   "&.Mui-selected": {
//                     backgroundColor: (theme) => theme.palette.action.selected,
//                   },
//                 }}
//               >
//                 <TableCell>{t.ticket_number}</TableCell>
//                 <TableCell>{format(t.pawn_datetime)}</TableCell>
//                 <TableCell>{format(t.due_date)}</TableCell>
//                 <TableCell>{format(t.pickup_datetime)}</TableCell>
//                 <TableCell>{t.location}</TableCell>

//                 {/* Description 限制长度 + 提示框 */}
//                 <TableCell
//                   sx={{
//                     maxWidth: 200,
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                   title={t.description}
//                 >
//                   {t.description}
//                 </TableCell>

//                 <TableCell>{t.pawn_price}</TableCell>
//                 <TableCell>{t.interest}</TableCell>
//                 <TableCell>{t.pickup_price}</TableCell>
//                 <TableCell>{t.status}</TableCell>
//                 <TableCell>{t.employee_id ?? "-"}</TableCell>
//                 <TableCell>{t.customer_number ?? "-"}</TableCell>
//                 <TableCell>{format(t.last_payment_date)}</TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default TicketTable;

import React, { useState } from "react";
import { Resizable } from "react-resizable";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { Ticket } from "../../../shared/models/Ticket";
import "react-resizable/css/styles.css";

export interface TicketTableProps {
  tickets: Ticket[];
  selectedTicketId?: number | string | null;
  onSelect: (id: number | string) => void;
}

// ---- Resizable Header Cell ----
const ResizableTableCell = (props: any) => {
  const { width, onResize, ...rest } = props;

  if (!width) return <TableCell {...rest} />;

  return (
    <Resizable
      height={0}
      width={width}
      onResize={onResize}
      handle={
        <span
          style={{
            position: "absolute",
            right: -5,
            top: 0,
            bottom: 0,
            width: 10,
            cursor: "col-resize",
            zIndex: 1,
          }}
        />
      }
    >
      <TableCell {...rest} style={{ width, position: "relative" }} />
    </Resizable>
  );
};

const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  selectedTicketId,
  onSelect,
}) => {
  const format = (date?: Date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  // ---- Column Width State ----
  const [colWidths, setColWidths] = useState({
    ticket_number: 120,
    pawn_datetime: 140,
    location: 120,
    description: 250,
    due_date: 140,
    pawn_price: 120,
    status: 120,
  });

  const onResize =
    (col: string) =>
    (e: any, { size }: any) => {
      setColWidths((prev) => ({ ...prev, [col]: size.width }));
    };

  return (
    <TableContainer sx={{ maxHeight: 350, maxWidth: "100%", overflow: "auto" }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {[
              { key: "ticket_number", label: "Ticket #" },
              { key: "pawn_datetime", label: "Pawn Date" },
              { key: "location", label: "Location" },
              { key: "description", label: "Item" },
              { key: "due_date", label: "Due Date" },
              { key: "pawn_price", label: "Pawn $" },
              { key: "status", label: "Status" },
            ].map((col) => (
              <ResizableTableCell
                key={col.key}
                width={colWidths[col.key]}
                onResize={onResize(col.key)}
              >
                <Typography fontWeight="bold">{col.label}</Typography>
              </ResizableTableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets.map((t) => {
            const isSelected =
              String(t.ticket_number) === String(selectedTicketId);
            return (
              <TableRow
                key={t.ticket_number}
                hover
                selected={isSelected}
                onClick={() => onSelect(t.ticket_number)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell width={colWidths.ticket_number}>
                  {t.ticket_number}
                </TableCell>
                <TableCell width={colWidths.pawn_datetime}>
                  {format(t.pawn_datetime)}
                </TableCell>
                <TableCell width={colWidths.location}>{t.location}</TableCell>
                <TableCell
                  width={colWidths.description}
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {t.description}
                </TableCell>
                <TableCell width={colWidths.due_date}>
                  {format(t.due_date)}
                </TableCell>
                <TableCell width={colWidths.pawn_price}>
                  {t.pawn_price}
                </TableCell>
                <TableCell width={colWidths.status}>
                  <Typography>{t.status}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketTable;
