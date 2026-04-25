import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import type { Item } from "../../../../shared/types/Item";
import {
  itemService,
  type ItemCategoryOption,
  type SaveItemInput,
} from "../../../services/itemService";
import ItemCategoryDialog from "./ItemCategoryDialog";
import ItemPhotoCapture from "./ItemPhotoCapture";

interface ItemEditDialogProps {
  open: boolean;
  mode: "add" | "edit";
  ticketNumber: number;
  item?: Item | null;
  categories: ItemCategoryOption[];
  onClose: () => void;
  onSave: (item: Item) => void;
}

const findItemCategory = (
  categories: ItemCategoryOption[],
  item?: Item | null,
) =>
  categories.find((category) => category.subcategory_id === item?.subcategory_id) ??
  null;

const ItemEditDialog: React.FC<ItemEditDialogProps> = ({
  open,
  mode,
  ticketNumber,
  item,
  categories,
  onClose,
  onSave,
}) => {
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<ItemCategoryOption | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState<number | "">(1);
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [imagePath, setImagePath] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const compactFieldSx = {
    "& .MuiFormHelperText-root": {
      minHeight: 16,
      marginTop: 0.25,
      lineHeight: 1.15,
    },
  } as const;

  const title = mode === "add" ? "Add Item" : "Edit Item";
  const categoryLabel = useMemo(() => {
    if (!category) return "";
    return `${category.category_name.toUpperCase()} / ${category.subcategory_name.toLowerCase()}`;
  }, [category]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const initialCategory = findItemCategory(categories, item);
    setCategory(initialCategory);
    setCategoryDialogOpen(mode === "add");
    setQuantity(item?.quantity ?? 1);
    setDescription(item?.description ?? "");
    setBrandName(item?.brand_name ?? "");
    setModelNumber(item?.model_number ?? "");
    setSerialNumber(item?.serial_number ?? "");
    setAmount(item?.amount ?? "");
    setImagePath(item?.image_path ?? "");
    setCategoryError("");
    setQuantityError("");
    setDescriptionError("");
    setAmountError("");
    setPhotoError("");
    setSubmitError("");
    setSaving(false);
  }, [categories, item, mode, open]);

  const handleCapture = async (fileName: string, base64: string) => {
    const savedPath = await itemService.saveItemImage(fileName, base64);
    setImagePath(savedPath);
    setPhotoError("");
    setSubmitError("");
  };

  const focusDescription = () => {
    const id = requestAnimationFrame(() => {
      descriptionRef.current?.focus();
      descriptionRef.current?.select();
    });
    return () => cancelAnimationFrame(id);
  };

  const handleSave = async (event?: FormEvent) => {
    event?.preventDefault();

    const nextCategoryError = !category ? "Select a category." : "";
    const nextQuantityError =
      typeof quantity !== "number" || quantity <= 0
        ? "Quantity must be greater than 0."
        : "";
    const nextDescriptionError = !description.trim()
      ? "Description is required."
      : "";
    const nextAmountError =
      typeof amount !== "number" || amount < 0
        ? "Price cannot be negative."
        : "";
    const nextPhotoError =
      mode === "add" && !imagePath.trim() ? "Take an item photo." : "";

    setCategoryError(nextCategoryError);
    setQuantityError(nextQuantityError);
    setDescriptionError(nextDescriptionError);
    setAmountError(nextAmountError);
    setPhotoError(nextPhotoError);
    setSubmitError("");

    if (
      nextCategoryError ||
      nextQuantityError ||
      nextDescriptionError ||
      nextAmountError ||
      nextPhotoError
    ) {
      return;
    }

    const selectedCategory = category;
    const normalizedQuantity = quantity;
    const normalizedAmount = amount;

    if (!selectedCategory || normalizedQuantity === "" || normalizedAmount === "") {
      return;
    }

    const payload: SaveItemInput = {
      item_number: item?.item_number,
      ticket_number: ticketNumber,
      quantity: normalizedQuantity,
      subcategory_id: selectedCategory.subcategory_id,
      description,
      brand_name: brandName,
      model_number: modelNumber,
      serial_number: serialNumber,
      amount: normalizedAmount,
      image_path: imagePath,
    };

    setSaving(true);
    setSubmitError("");

    try {
      const savedItem =
        mode === "add"
          ? await itemService.createItem(payload)
          : await itemService.updateItem(payload);

      onSave({
        ...savedItem,
        category_name: selectedCategory.category_name,
        subcategory_name: selectedCategory.subcategory_name,
      });
    } catch (err) {
      console.error(err);
      setSubmitError(
        err instanceof Error ? err.message : "Couldn't save this item right now.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ pb: 1.5 }}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSave}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 1 }}>
                  <TextField
                    label="Category"
                    value={categoryLabel}
                    disabled
                    fullWidth
                    required
                    error={Boolean(categoryError)}
                    helperText={categoryError || " "}
                    sx={compactFieldSx}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setCategoryDialogOpen(true)}
                    sx={{ height: 56, minWidth: 92 }}
                  >
                    {mode === "edit" ? "Re-select Category" : "Select"}
                  </Button>
                </Box>

                <TextField
                  inputRef={descriptionRef}
                  label="Description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value.toUpperCase());
                    if (descriptionError) setDescriptionError("");
                    if (submitError) setSubmitError("");
                  }}
                  fullWidth
                  required
                  error={Boolean(descriptionError)}
                  helperText={descriptionError || " "}
                  sx={compactFieldSx}
                />

                <TextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(
                      event.target.value === "" ? "" : Number(event.target.value),
                    );
                    if (quantityError) setQuantityError("");
                    if (submitError) setSubmitError("");
                  }}
                  required
                  error={Boolean(quantityError)}
                  helperText={quantityError || " "}
                  sx={compactFieldSx}
                />

                <TextField
                  label="Brand"
                  value={brandName}
                  onChange={(event) => setBrandName(event.target.value.toUpperCase())}
                  helperText=" "
                  sx={compactFieldSx}
                />

                <TextField
                  label="Model"
                  value={modelNumber}
                  onChange={(event) => setModelNumber(event.target.value.toUpperCase())}
                  helperText=" "
                  sx={compactFieldSx}
                />

                <TextField
                  label="Serial"
                  value={serialNumber}
                  onChange={(event) => setSerialNumber(event.target.value.toUpperCase())}
                  helperText=" "
                  sx={compactFieldSx}
                />

                <TextField
                  label="Price"
                  type="number"
                  value={amount}
                  onChange={(event) => {
                    setAmount(
                      event.target.value === "" ? "" : Number(event.target.value),
                    );
                    if (amountError) setAmountError("");
                    if (submitError) setSubmitError("");
                  }}
                  required
                  error={Boolean(amountError)}
                  helperText={amountError || " "}
                  sx={compactFieldSx}
                />
              </Box>

              <Box
                sx={{
                  width: 270,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <ItemPhotoCapture
                  imagePath={imagePath}
                  itemNumber={item?.item_number}
                  active={open}
                  previewSize={230}
                  error={Boolean(photoError)}
                  onCapture={handleCapture}
                />
                <Typography
                  variant="body2"
                  color={photoError ? "error" : "text.secondary"}
                  sx={{
                    width: "100%",
                    minHeight: 24,
                    visibility: photoError || submitError ? "visible" : "hidden",
                  }}
                >
                  {photoError || submitError || " "}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mt: 0.25,
              }}
            >
              <Button type="button" onClick={onClose} disabled={saving} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {mode === "add" ? "Add" : "Save"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ItemCategoryDialog
        open={categoryDialogOpen}
        categories={categories}
        onClose={() => setCategoryDialogOpen(false)}
        onSelect={(nextCategory) => {
          setCategory(nextCategory);
          setCategoryError("");
          setCategoryDialogOpen(false);
          focusDescription();
        }}
      />
    </>
  );
};

export default ItemEditDialog;
