import React from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";
import type { Item } from "../../../../../shared/types/Item";
import CellTooltip from "../../../../components/shared/CellTooltip";
import { itemService } from "../../../../services/itemService";
import { ticketService } from "../../../../services/ticketService";
import { formatCurrency, formatUppercase } from "../../../../utils/formatters";

type ItemSearchMode = "item-number" | "details";

const ticketSearchHistoryStatuses = new Set([
  "pawn_expired",
  "picked_up",
  "sell_expired",
]);

const formatTicketStatus = (status?: string) =>
  status ? status.replaceAll("_", " ").toUpperCase() : "---";

const itemSearchColumns: GridColDef<Item>[] = [
  {
    field: "item_number",
    headerName: "ITEM #",
    width: 90,
    renderCell: (params) => <CellTooltip value={params.value} fallback="---" />,
  },
  {
    field: "latest_ticket_number",
    headerName: "TICKET #",
    width: 100,
    renderCell: (params) => <CellTooltip value={params.value} fallback="---" />,
  },
  {
    field: "latest_ticket_status",
    headerName: "TICKET STATUS",
    width: 140,
    renderCell: (params) => (
      <CellTooltip value={formatTicketStatus(params.value)} fallback="---" />
    ),
  },
  {
    field: "quantity",
    headerName: "QTY",
    width: 70,
    renderCell: (params) => <CellTooltip value={params.value} fallback="---" />,
  },
  {
    field: "brand_name",
    headerName: "BRAND",
    width: 130,
    renderCell: (params) => (
      <CellTooltip
        value={formatUppercase(params.value, "---")}
        fallback="---"
      />
    ),
  },
  {
    field: "model_number",
    headerName: "MODEL",
    width: 130,
    renderCell: (params) => (
      <CellTooltip
        value={formatUppercase(params.value, "---")}
        fallback="---"
      />
    ),
  },
  {
    field: "serial_number",
    headerName: "SERIAL",
    width: 150,
    renderCell: (params) => (
      <CellTooltip
        value={formatUppercase(params.value, "---")}
        fallback="---"
      />
    ),
  },
  {
    field: "description",
    headerName: "DESCRIPTION",
    width: 240,
    renderCell: (params) => <CellTooltip value={params.value} fallback="---" />,
  },
  {
    field: "subcategory_name",
    headerName: "SUBCATEGORY",
    width: 150,
    renderCell: (params) => <CellTooltip value={params.value} fallback="---" />,
  },
  {
    field: "category_name",
    headerName: "CATEGORY",
    width: 130,
    renderCell: (params) => <CellTooltip value={params.value} fallback="---" />,
  },
  {
    field: "amount",
    headerName: "PRICE",
    width: 100,
    renderCell: (params) => (
      <CellTooltip value={formatCurrency(params.value)} fallback="---" />
    ),
  },
  {
    field: "image_path",
    headerName: "IMAGE PATH",
    width: 240,
    renderCell: (params) => <CellTooltip value={params.value} fallback="---" />,
  },
];

const ItemSearchWindow: React.FC<MenuActionComponentProps> = ({ actionId }) => {
  const itemNumberInputRef = React.useRef<HTMLInputElement>(null);
  const brandInputRef = React.useRef<HTMLInputElement>(null);
  const [mode, setMode] = React.useState<ItemSearchMode>("item-number");
  const [itemNumber, setItemNumber] = React.useState("");
  const [brandName, setBrandName] = React.useState("");
  const [modelNumber, setModelNumber] = React.useState("");
  const [serialNumber, setSerialNumber] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [openingTicket, setOpeningTicket] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (mode === "item-number") {
        itemNumberInputRef.current?.focus();
        itemNumberInputRef.current?.select();
      } else {
        brandInputRef.current?.focus();
        brandInputRef.current?.select();
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [mode]);

  const handleSearch = async () => {
    setError("");
    setMessage("");

    const normalizedItemNumber = Number(itemNumber);
    const normalizedBrandName = brandName.trim();
    const normalizedModelNumber = modelNumber.trim();
    const normalizedSerialNumber = serialNumber.trim();

    if (
      mode === "item-number" &&
      (!Number.isFinite(normalizedItemNumber) || normalizedItemNumber <= 0)
    ) {
      setError("Enter a valid item number.");
      return;
    }

    if (
      mode === "details" &&
      !normalizedBrandName &&
      !normalizedModelNumber &&
      !normalizedSerialNumber
    ) {
      setError("Enter at least one search field.");
      return;
    }

    setSearching(true);

    try {
      const results = await itemService.searchItems(
        mode === "item-number"
          ? { item_number: normalizedItemNumber }
          : {
              brand_name: normalizedBrandName,
              model_number: normalizedModelNumber,
              serial_number: normalizedSerialNumber,
            },
      );

      setItems(results);
      setSelectedItem(null);
      setMessage(
        results.length
          ? `${results.length} item(s) found.`
          : "No matching items found.",
      );
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to search items.");
    } finally {
      setSearching(false);
    }
  };

  const handleGoToTicket = async () => {
    if (!selectedItem?.latest_ticket_number) {
      return;
    }

    setOpeningTicket(true);
    setError("");

    try {
      const result = await ticketService.searchTicket(
        selectedItem.latest_ticket_number,
      );

      if (!result) {
        setError("The selected item's ticket was not found.");
        return;
      }

      const targetTab =
        result.ticket.is_stolen ||
        ticketSearchHistoryStatuses.has(result.ticket.status)
          ? "history"
          : "transaction";
      const channel = new BroadcastChannel("menu-events");

      channel.postMessage({
        type: "ticket-search-selected",
        ticket: result.ticket,
        client: result.client,
        targetTab,
      });
      channel.close();
      window.close();
    } catch (err) {
      console.error(err);
      setError("Unable to open the selected item's ticket right now.");
    } finally {
      setOpeningTicket(false);
    }
  };

  return (
    <MenuActionPlaceholder
      actionId={actionId}
      title="Search Item"
      description="Search by item number, or by brand/model/serial."
    >
      <Stack spacing={1.25} sx={{ height: "100%", minHeight: 0 }}>
        <Stack direction="row" justifyContent="space-between">
          <ToggleButtonGroup
            exclusive
            size="small"
            value={mode}
            onChange={(_event, nextMode: ItemSearchMode | null) => {
              if (!nextMode) {
                return;
              }

              setMode(nextMode);
              setError("");
              setMessage("");
            }}
          >
            <ToggleButton value="item-number">Item #</ToggleButton>
            <ToggleButton value="details">Brand / Model / Serial</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            disabled={!selectedItem?.latest_ticket_number || openingTicket}
            onClick={() => void handleGoToTicket()}
          >
            {openingTicket ? "Opening..." : "Go to Ticket"}
          </Button>
        </Stack>

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSearch();
          }}
          sx={{ pt: 0.5 }}
        >
          {mode === "item-number" ? (
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TextField
                inputRef={itemNumberInputRef}
                size="small"
                label="Item Number"
                value={itemNumber}
                onChange={(event) => {
                  setItemNumber(event.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                inputProps={{ inputMode: "numeric" }}
                sx={{ width: 220 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={searching}
                sx={{ minWidth: 96 }}
              >
                Search
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TextField
                inputRef={brandInputRef}
                size="small"
                label="Brand Name"
                value={brandName}
                onChange={(event) => {
                  setBrandName(event.target.value);
                  setError("");
                }}
                sx={{ width: 180 }}
              />
              <TextField
                size="small"
                label="Model Number"
                value={modelNumber}
                onChange={(event) => {
                  setModelNumber(event.target.value);
                  setError("");
                }}
                sx={{ width: 180 }}
              />
              <TextField
                size="small"
                label="Serial Number"
                value={serialNumber}
                onChange={(event) => {
                  setSerialNumber(event.target.value);
                  setError("");
                }}
                sx={{ width: 180 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={searching}
                sx={{ minWidth: 96 }}
              >
                Search
              </Button>
            </Stack>
          )}
        </Box>

        {error && <Alert severity="error">{error}</Alert>}
        {message && (
          <Alert severity={items.length ? "success" : "info"}>{message}</Alert>
        )}

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataGrid
            columnHeaderHeight={34}
            rowHeight={30}
            rows={items}
            columns={itemSearchColumns}
            getRowId={(row) => row.item_number}
            rowSelectionModel={
              selectedItem?.item_number ? [selectedItem.item_number] : []
            }
            onRowClick={(params) => setSelectedItem(params.row)}
            loading={searching}
            disableColumnMenu
            disableColumnSorting
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            hideFooter
            localeText={{ noRowsLabel: "No items" }}
            sx={{
              border: "1px solid #ccc",
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid #bbb",
              },
              "& .MuiDataGrid-columnHeader": {
                borderRight: "1px solid #ddd",
                backgroundColor: "#fafafa",
                py: 0,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "#d0d7de",
              },
              "& .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor: "#c6d0d9",
              },
              "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
                borderRight: "1px solid #9aa4af",
                borderBottom: "1px solid #9aa4af",
              },
            }}
          />
        </Box>
      </Stack>
    </MenuActionPlaceholder>
  );
};

export default ItemSearchWindow;
