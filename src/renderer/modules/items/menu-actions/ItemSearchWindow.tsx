import React from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridPaginationModel } from "@mui/x-data-grid";
import WindowLayout from "../../../windows/WindowLayout";
import type { WindowScreenProps } from "../../../windows/windowRegistry";
import type { ItemCategoryOption } from "../../../../shared/contracts/item.contract";
import type { Item } from "../../../../shared/models/item.model";
import TransactionItemImage from "../components/transaction/TransactionItemImage";
import { itemService } from "../item.api";
import { ticketService } from "../../tickets/ticket.api";
import { itemSearchColumns } from "./itemSearchColumns";

type ItemSearchMode = "item-number" | "details";

const ITEM_SEARCH_PAGE_SIZE = 100;

type ItemSearchAddToTicketResultEvent = {
  type: "item-search-add-to-ticket-result";
  requestId: string;
  item?: Item;
  message?: string;
  error?: string;
};

const ticketSearchHistoryStatuses = new Set([
  "pawned_expired",
  "pawned_picked_up",
  "sold_expired",
]);

const activeItemTicketStatuses = new Set(["pawned", "sold"]);

const isItemSearchAddToTicketResultEvent = (
  value: unknown,
): value is ItemSearchAddToTicketResultEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    (value as { type?: string }).type === "item-search-add-to-ticket-result"
  );
};

const ItemSearchWindow: React.FC<WindowScreenProps> = () => {
  const itemNumberInputRef = React.useRef<HTMLInputElement>(null);
  const brandInputRef = React.useRef<HTMLInputElement>(null);
  const menuEventsChannelRef = React.useRef<BroadcastChannel | null>(null);
  const addToTicketRequestIdRef = React.useRef("");
  const [mode, setMode] = React.useState<ItemSearchMode>("details");
  const [itemNumber, setItemNumber] = React.useState("");
  const [categories, setCategories] = React.useState<ItemCategoryOption[]>([]);
  const [categoryName, setCategoryName] = React.useState("");
  const [subcategory, setSubcategory] =
    React.useState<ItemCategoryOption | null>(null);
  const [brandName, setBrandName] = React.useState("");
  const [modelNumber, setModelNumber] = React.useState("");
  const [serialNumber, setSerialNumber] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [openingTicket, setOpeningTicket] = React.useState(false);
  const [addingToTicket, setAddingToTicket] = React.useState(false);
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: ITEM_SEARCH_PAGE_SIZE,
    });

  const categoryNames = React.useMemo(
    () =>
      [...new Set(categories.map((category) => category.category_name))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [categories],
  );

  const subcategoryOptions = React.useMemo(() => {
    const options = categoryName
      ? categories.filter((category) => category.category_name === categoryName)
      : categories;

    return [...options].sort((a, b) =>
      a.subcategory_name.localeCompare(b.subcategory_name),
    );
  }, [categories, categoryName]);

  const selectedCategoryId = React.useMemo(() => {
    if (!categoryName) {
      return undefined;
    }

    return categories.find(
      (category) => category.category_name === categoryName,
    )?.category_id;
  }, [categories, categoryName]);
  const pageCount = Math.max(
    1,
    Math.ceil(items.length / ITEM_SEARCH_PAGE_SIZE),
  );
  const currentPage = Math.min(paginationModel.page, pageCount - 1);

  const setPage = (page: number) => {
    setPaginationModel({
      page: Math.min(Math.max(page, 0), pageCount - 1),
      pageSize: ITEM_SEARCH_PAGE_SIZE,
    });
  };

  const CompactFooter = () => (
    <Box
      sx={{
        height: 28,
        minHeight: 28,
        px: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 0.25,
        borderTop: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    >
      <IconButton
        size="small"
        disabled={currentPage <= 0}
        onClick={() => setPage(0)}
        sx={{ width: 24, height: 24, p: 0 }}
      >
        <FirstPage fontSize="inherit" />
      </IconButton>
      <IconButton
        size="small"
        disabled={currentPage <= 0}
        onClick={() => setPage(currentPage - 1)}
        sx={{ width: 24, height: 24, p: 0 }}
      >
        <KeyboardArrowLeft fontSize="inherit" />
      </IconButton>
      <Typography
        component="span"
        sx={{
          minWidth: 40,
          textAlign: "center",
          fontSize: 12,
          lineHeight: "24px",
          color: "text.secondary",
        }}
      >
        {currentPage + 1} / {pageCount}
      </Typography>
      <IconButton
        size="small"
        disabled={currentPage >= pageCount - 1}
        onClick={() => setPage(currentPage + 1)}
        sx={{ width: 24, height: 24, p: 0 }}
      >
        <KeyboardArrowRight fontSize="inherit" />
      </IconButton>
      <IconButton
        size="small"
        disabled={currentPage >= pageCount - 1}
        onClick={() => setPage(pageCount - 1)}
        sx={{ width: 24, height: 24, p: 0 }}
      >
        <LastPage fontSize="inherit" />
      </IconButton>
    </Box>
  );

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

  React.useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      const loadedCategories = await itemService.preloadCategories();

      if (!active) {
        return;
      }

      setCategories(loadedCategories);
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    setPaginationModel((prev) =>
      prev.page === 0
        ? prev
        : {
            page: 0,
            pageSize: ITEM_SEARCH_PAGE_SIZE,
          },
    );
  }, [items]);

  React.useEffect(() => {
    const channel = new BroadcastChannel("menu-events");
    menuEventsChannelRef.current = channel;

    channel.onmessage = (event: MessageEvent) => {
      if (
        !isItemSearchAddToTicketResultEvent(event.data) ||
        event.data.requestId !== addToTicketRequestIdRef.current
      ) {
        return;
      }

      setAddingToTicket(false);

      if (event.data.error) {
        setError(event.data.error);
        return;
      }

      if (event.data.item) {
        setItems((prev) =>
          prev.map((item) =>
            item.item_number === event.data.item?.item_number
              ? event.data.item
              : item,
          ),
        );
        setSelectedItem(event.data.item);
      }

      setMessage(event.data.message ?? "Item added to ticket.");
    };

    return () => {
      menuEventsChannelRef.current = null;
      channel.close();
    };
  }, []);

  const handleSearch = async () => {
    setError("");
    setMessage("");

    const normalizedItemNumber = Number(itemNumber);
    const normalizedCategoryId = selectedCategoryId;
    const normalizedSubcategoryId = subcategory?.subcategory_id;
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
      !normalizedCategoryId &&
      !normalizedSubcategoryId &&
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
              category_id: normalizedCategoryId,
              subcategory_id: normalizedSubcategoryId,
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
      const result = await ticketService.searchTicketByNumber(
        selectedItem.latest_ticket_number,
      );

      if (!result) {
        setError("The selected item's ticket was not found.");
        return;
      }

      const targetTab = ticketSearchHistoryStatuses.has(result.ticket.status)
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
    } catch (err) {
      console.error(err);
      setError("Unable to open the selected item's ticket right now.");
    } finally {
      setOpeningTicket(false);
    }
  };

  const handleAddToTicket = () => {
    if (
      !selectedItem ||
      activeItemTicketStatuses.has(selectedItem.latest_ticket_status ?? "")
    ) {
      return;
    }

    const requestId = crypto.randomUUID();
    addToTicketRequestIdRef.current = requestId;
    setAddingToTicket(true);
    setError("");
    setMessage("");
    menuEventsChannelRef.current?.postMessage({
      type: "item-search-add-to-ticket",
      requestId,
      itemNumber: selectedItem.item_number,
    });
  };

  const modeButtons = (
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
      sx={{ flexShrink: 0 }}
    >
      <ToggleButton value="details">Detail</ToggleButton>
      <ToggleButton value="item-number">Item #</ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <WindowLayout
      title="Search Item"
      description="Search by item number, or by item details."
    >
      <Stack spacing={0.5} sx={{ height: "100%", minHeight: 0 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box>{modeButtons}</Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 1,
              }}
            >
              <Stack spacing={0.5} sx={{ minWidth: 124 }}>
                <Button
                  variant="contained"
                  size="small"
                  disabled={
                    !selectedItem?.latest_ticket_number || openingTicket
                  }
                  onClick={() => void handleGoToTicket()}
                >
                  {openingTicket ? "Opening..." : "Go to Ticket"}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  disabled={
                    !selectedItem ||
                    activeItemTicketStatuses.has(
                      selectedItem.latest_ticket_status ?? "",
                    ) ||
                    addingToTicket
                  }
                  onClick={handleAddToTicket}
                >
                  {addingToTicket ? "Adding..." : "Add to Ticket"}
                </Button>
              </Stack>

              <Box sx={{ width: 174, height: 106, flexShrink: 0 }}>
                <TransactionItemImage
                  selectedItem={selectedItem ?? undefined}
                />
              </Box>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSearch();
            }}
            sx={{
              minWidth: 0,
            }}
          >
            {mode === "item-number" ? (
              <Stack direction="row" spacing={0.75} alignItems="flex-start">
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
                  sx={{ width: 180 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={searching}
                  sx={{ minWidth: 86 }}
                >
                  Search
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={0.75} alignItems="flex-start">
                <TextField
                  inputRef={brandInputRef}
                  size="small"
                  label="Brand"
                  value={brandName}
                  onChange={(event) => {
                    setBrandName(event.target.value);
                    setError("");
                  }}
                  sx={{ flex: "1 1 112px", minWidth: 90 }}
                />
                <TextField
                  size="small"
                  label="Model"
                  value={modelNumber}
                  onChange={(event) => {
                    setModelNumber(event.target.value);
                    setError("");
                  }}
                  sx={{ flex: "1 1 112px", minWidth: 90 }}
                />
                <TextField
                  size="small"
                  label="Serial"
                  value={serialNumber}
                  onChange={(event) => {
                    setSerialNumber(event.target.value);
                    setError("");
                  }}
                  sx={{ flex: "1 1 128px", minWidth: 100 }}
                />
                <Autocomplete
                  size="small"
                  value={categoryName || null}
                  options={categoryNames}
                  onChange={(_event, nextCategoryName) => {
                    setCategoryName(nextCategoryName ?? "");
                    setSubcategory(null);
                    setError("");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" />
                  )}
                  sx={{ flex: "1.2 1 150px", minWidth: 128 }}
                />
                <Autocomplete
                  size="small"
                  value={subcategory}
                  options={subcategoryOptions}
                  getOptionLabel={(option) => option.subcategory_name}
                  isOptionEqualToValue={(option, value) =>
                    option.subcategory_id === value.subcategory_id
                  }
                  onChange={(_event, nextSubcategory) => {
                    setSubcategory(nextSubcategory);
                    if (nextSubcategory) {
                      setCategoryName(nextSubcategory.category_name);
                    }
                    setError("");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Subcategory" />
                  )}
                  sx={{ flex: "1.5 1 190px", minWidth: 150 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={searching}
                  sx={{ minWidth: 86 }}
                >
                  Search
                </Button>
              </Stack>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ py: 0, alignItems: "center" }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1.5,
              mb: 0.25,
              mr: 1,
              minHeight: 18,
            }}
          >
            {message && (
              <Typography
                variant="caption"
                color={items.length ? "success.main" : "text.secondary"}
                sx={{ fontWeight: 700 }}
              >
                {message}
              </Typography>
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 1000 }}
            >
              Results: {items.length}
            </Typography>
          </Box>
          <DataGrid
            columnHeaderHeight={34}
            rowHeight={30}
            rows={items}
            columns={itemSearchColumns}
            getRowId={(row) => row.item_number}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              setPaginationModel({
                page: model.page,
                pageSize: ITEM_SEARCH_PAGE_SIZE,
              });
            }}
            pageSizeOptions={[ITEM_SEARCH_PAGE_SIZE]}
            slots={{ footer: CompactFooter }}
            rowSelectionModel={
              selectedItem?.item_number ? [selectedItem.item_number] : []
            }
            onRowClick={(params) => setSelectedItem(params.row)}
            getRowClassName={(params) =>
              activeItemTicketStatuses.has(
                params.row.latest_ticket_status ?? "",
              )
                ? "pawned-item-row"
                : ""
            }
            loading={searching}
            disableColumnMenu
            disableColumnSorting
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
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
              "& .MuiDataGrid-row.pawned-item-row": {
                backgroundColor: "#ffcdd2",
              },
              "& .MuiDataGrid-row.pawned-item-row:hover": {
                backgroundColor: "#ef9a9a",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "#d0d7de",
              },
              "& .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor: "#c6d0d9",
              },
              "& .MuiDataGrid-row.pawned-item-row.Mui-selected": {
                backgroundColor: "#ef9a9a",
              },
              "& .MuiDataGrid-row.pawned-item-row.Mui-selected:hover": {
                backgroundColor: "#e57373",
              },
              "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
                borderRight: "1px solid #9aa4af",
                borderBottom: "1px solid #9aa4af",
              },
            }}
          />
        </Box>
      </Stack>
    </WindowLayout>
  );
};

export default ItemSearchWindow;
