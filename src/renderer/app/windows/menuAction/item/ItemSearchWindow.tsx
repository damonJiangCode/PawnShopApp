import React from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import MenuActionPlaceholder from "../MenuActionPlaceholder";
import type { MenuActionComponentProps } from "../menuActionTypes";
import type { Item } from "../../../../../shared/types/Item";
import { itemService } from "../../../../services/itemService";
import { formatCurrency, formatUppercase } from "../../../../utils/formatters";

type ItemSearchMode = "item-number" | "details";

const ItemSearchWindow: React.FC<MenuActionComponentProps> = ({ actionId }) => {
  const itemNumberInputRef = React.useRef<HTMLInputElement>(null);
  const brandInputRef = React.useRef<HTMLInputElement>(null);
  const [mode, setMode] = React.useState<ItemSearchMode>("item-number");
  const [itemNumber, setItemNumber] = React.useState("");
  const [brandName, setBrandName] = React.useState("");
  const [modelNumber, setModelNumber] = React.useState("");
  const [serialNumber, setSerialNumber] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([]);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [searching, setSearching] = React.useState(false);

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

  return (
    <MenuActionPlaceholder
      actionId={actionId}
      title="Search Item"
      description="Search by item number, or by brand/model/serial."
    >
      <Stack spacing={1.25} sx={{ height: "100%", minHeight: 0 }}>
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

        <Paper
          variant="outlined"
          sx={{ flex: 1, minHeight: 0, overflow: "auto" }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Item #</TableCell>
                <TableCell>Ticket #</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sub</TableCell>
                <TableCell>Cat</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length ? (
                items.map((item) => (
                  <TableRow key={item.item_number}>
                    <TableCell>{item.item_number}</TableCell>
                    <TableCell>{item.latest_ticket_number ?? "---"}</TableCell>
                    <TableCell>
                      {formatUppercase(item.brand_name, "---")}
                    </TableCell>
                    <TableCell>
                      {formatUppercase(item.model_number, "---")}
                    </TableCell>
                    <TableCell>
                      {formatUppercase(item.serial_number, "---")}
                    </TableCell>
                    <TableCell>{item.description || "---"}</TableCell>
                    <TableCell>{item.subcategory_name || "---"}</TableCell>
                    <TableCell>{item.category_name || "---"}</TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography color="text.secondary" variant="body2">
                      Search results will appear here.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </MenuActionPlaceholder>
  );
};

export default ItemSearchWindow;
