import React from "react";
import type {
  GridPaginationModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import type { ItemCategoryOption } from "../../../../../shared/payload-contracts/item.contract";
import type { Item } from "../../../../../shared/models/item.model";
import { getAppApi } from "../../../../shared/api/app.api";
import { itemApi } from "../../item.api";
import { ticketApi } from "../../../tickets/ticket.api";
import {
  getItemId,
  isItemAddable,
  ITEM_SEARCH_WINDOW_PAGE_SIZE,
  mergeCheckedItemIds,
  mergeItems,
  ticketSearchHistoryStatuses,
  type ItemSearchWindowMode,
  type ItemSearchWindowTargetStatus,
} from "./itemSearchWindow.helpers";

type ItemSearchAddToTicketResultEvent = {
  type: "item-search-add-to-ticket-result";
  requestId: string;
  item?: Item;
  items?: Item[];
  message?: string;
  error?: string;
};

type ItemSearchTargetStatusEvent = ItemSearchWindowTargetStatus & {
  type: "item-search-target-status";
  requestId?: string;
};

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

const isItemSearchTargetStatusEvent = (
  value: unknown,
): value is ItemSearchTargetStatusEvent => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (value as { type?: string }).type === "item-search-target-status";
};

export const useItemSearchWindow = () => {
  const itemNumberInputRef = React.useRef<HTMLInputElement>(null);
  const serialNumberInputRef = React.useRef<HTMLInputElement>(null);
  const menuEventsChannelRef = React.useRef<BroadcastChannel | null>(null);
  const addToTicketRequestIdRef = React.useRef("");
  const loadedInputItemIdsRef = React.useRef<Set<string>>(new Set());
  const [mode, setMode] = React.useState<ItemSearchWindowMode>("details");
  const [itemNumber, setItemNumber] = React.useState("");
  const [categories, setCategories] = React.useState<ItemCategoryOption[]>([]);
  const [categoryName, setCategoryName] = React.useState("");
  const [subcategory, setSubcategory] =
    React.useState<ItemCategoryOption | null>(null);
  const [brandName, setBrandName] = React.useState("");
  const [modelNumber, setModelNumber] = React.useState("");
  const [serialNumber, setSerialNumber] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([]);
  const [checkedItemIds, setCheckedItemIds] =
    React.useState<GridRowSelectionModel>([]);
  const [previewItem, setPreviewItem] = React.useState<Item | null>(null);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [openingTicket, setOpeningTicket] = React.useState(false);
  const [addingToTicket, setAddingToTicket] = React.useState(false);
  const [targetStatus, setTargetStatus] =
    React.useState<ItemSearchWindowTargetStatus>({
      canAddToTicket: false,
    });
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: ITEM_SEARCH_WINDOW_PAGE_SIZE,
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

  const checkedItems = React.useMemo(() => {
    const checkedIdSet = new Set(checkedItemIds.map(String));
    return items.filter((item) => checkedIdSet.has(String(getItemId(item))));
  }, [checkedItemIds, items]);

  const addableCheckedItems = React.useMemo(
    () => checkedItems.filter(isItemAddable),
    [checkedItems],
  );

  const goToTicketItem = checkedItems.length === 1 ? checkedItems[0] : null;
  const canSearch =
    mode === "item-number"
      ? Boolean(itemNumber.trim())
      : Boolean(
          selectedCategoryId ||
          subcategory?.subcategory_id ||
          brandName.trim() ||
          modelNumber.trim() ||
          serialNumber.trim(),
        );
  const canGoToTicket =
    checkedItems.length === 1 &&
    Boolean(goToTicketItem?.latest_ticket_number) &&
    !openingTicket;
  const canAddToTicket =
    targetStatus.canAddToTicket &&
    addableCheckedItems.length > 0 &&
    !addingToTicket;
  const pageCount = Math.max(
    1,
    Math.ceil(items.length / ITEM_SEARCH_WINDOW_PAGE_SIZE),
  );
  const currentPage = Math.min(paginationModel.page, pageCount - 1);

  const setPage = (page: number) => {
    setPaginationModel({
      page: Math.min(Math.max(page, 0), pageCount - 1),
      pageSize: ITEM_SEARCH_WINDOW_PAGE_SIZE,
    });
  };

  const appendLoadedItems = React.useCallback(async () => {
    const input =
      (await getAppApi()?.window.getItemSearchWindowInput()) ?? null;

    if (!input?.items.length) {
      return;
    }

    const nextItems = input.items.filter((item) => {
      const itemId = String(getItemId(item));
      return !loadedInputItemIdsRef.current.has(itemId);
    });

    input.items.forEach((item) => {
      loadedInputItemIdsRef.current.add(String(getItemId(item)));
    });

    if (!nextItems.length) {
      return;
    }

    const nextCheckedIds = nextItems.filter(isItemAddable).map(getItemId);

    setItems((prev) => mergeItems(prev, nextItems));
    setCheckedItemIds((prev) => mergeCheckedItemIds(prev, nextCheckedIds));
    setPreviewItem((prev) => prev ?? nextItems[0] ?? null);
    setMessage(
      input.sourceTicketNumber
        ? `${nextItems.length} item(s) loaded from ticket #${input.sourceTicketNumber}.`
        : `${nextItems.length} item(s) loaded.`,
    );
    setError("");
  }, []);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (mode === "item-number") {
        itemNumberInputRef.current?.focus();
        itemNumberInputRef.current?.select();
      } else {
        serialNumberInputRef.current?.focus();
        serialNumberInputRef.current?.select();
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [mode]);

  React.useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      const loadedCategories = await itemApi.preloadCategories();

      if (active) {
        setCategories(loadedCategories);
      }
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
            pageSize: ITEM_SEARCH_WINDOW_PAGE_SIZE,
          },
    );
  }, [items]);

  React.useEffect(() => {
    const channel = new BroadcastChannel("menu-events");
    const targetStatusRequestId = crypto.randomUUID();
    menuEventsChannelRef.current = channel;

    channel.onmessage = (event: MessageEvent) => {
      if (
        isItemSearchAddToTicketResultEvent(event.data) &&
        event.data.requestId === addToTicketRequestIdRef.current
      ) {
        const linkedItems =
          event.data.items ?? (event.data.item ? [event.data.item] : []);

        setAddingToTicket(false);

        if (event.data.error) {
          setError(event.data.error);
          return;
        }

        if (linkedItems.length) {
          const linkedItemIds = new Set(
            linkedItems.map((item) => item.item_number),
          );

          setItems((prev) =>
            prev.map(
              (item) =>
                linkedItems.find(
                  (linkedItem) => linkedItem.item_number === item.item_number,
                ) ?? item,
            ),
          );
          setCheckedItemIds((prev) =>
            prev.filter((id) => !linkedItemIds.has(Number(id))),
          );
          setPreviewItem((prev) => {
            if (!prev || !linkedItemIds.has(prev.item_number)) {
              return prev;
            }

            return linkedItems[0] ?? prev;
          });
        }

        setMessage(event.data.message ?? "Item(s) added to ticket.");
        setError("");
        return;
      }

      if (
        isItemSearchTargetStatusEvent(event.data) &&
        (!event.data.requestId ||
          event.data.requestId === targetStatusRequestId)
      ) {
        setTargetStatus(event.data);
      }
    };

    channel.postMessage({
      type: "item-search-target-status-request",
      requestId: targetStatusRequestId,
    });
    void appendLoadedItems();

    const unsubscribe =
      getAppApi()?.window.onItemSearchWindowInputUpdated(() => {
        void appendLoadedItems();
      }) ?? (() => {});

    return () => {
      menuEventsChannelRef.current = null;
      unsubscribe();
      channel.close();
    };
  }, [appendLoadedItems]);

  const handleSearch = async () => {
    setError("");
    setMessage("");

    const normalizedItemNumber = Number(itemNumber);

    if (!canSearch) {
      setError("Enter at least one search field.");
      return;
    }

    if (
      mode === "item-number" &&
      (!Number.isFinite(normalizedItemNumber) || normalizedItemNumber <= 0)
    ) {
      setError("Enter a valid item number.");
      return;
    }

    setSearching(true);

    try {
      const results = await itemApi.searchItems(
        mode === "item-number"
          ? { item_number: normalizedItemNumber }
          : {
              category_id: selectedCategoryId,
              subcategory_id: subcategory?.subcategory_id,
              brand_name: brandName.trim(),
              model_number: modelNumber.trim(),
              serial_number: serialNumber.trim(),
            },
      );
      const checkedIdSet = new Set(checkedItemIds.map(String));
      const retainedCheckedItems = items.filter((item) =>
        checkedIdSet.has(String(getItemId(item))),
      );
      const nextItems = mergeItems(retainedCheckedItems, results);

      setItems(nextItems);
      setCheckedItemIds(retainedCheckedItems.map(getItemId));
      setPreviewItem((prev) => {
        if (
          prev &&
          nextItems.some((item) => item.item_number === prev.item_number)
        ) {
          return prev;
        }

        return results[0] ?? retainedCheckedItems[0] ?? null;
      });
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
    if (!goToTicketItem?.latest_ticket_number) {
      setError("Select exactly one item with a ticket first.");
      return;
    }

    setOpeningTicket(true);
    setError("");

    try {
      const result = await ticketApi.searchTicketByNumber(
        goToTicketItem.latest_ticket_number,
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
    if (!canAddToTicket) {
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
      itemNumbers: addableCheckedItems.map((item) => item.item_number),
    });
  };

  const handleModeChange = (nextMode: ItemSearchWindowMode | null) => {
    if (!nextMode) {
      return;
    }

    setMode(nextMode);
    setError("");
    setMessage("");
  };

  const handleCheckedItemsChange = (model: GridRowSelectionModel) => {
    const addableIds = new Set(
      items.filter(isItemAddable).map((item) => String(getItemId(item))),
    );
    setCheckedItemIds(model.filter((id) => addableIds.has(String(id))));
  };

  return {
    refs: {
      itemNumberInputRef,
      serialNumberInputRef,
    },
    state: {
      mode,
      itemNumber,
      categoryName,
      subcategory,
      brandName,
      modelNumber,
      serialNumber,
      items,
      checkedItemIds,
      checkedItems,
      previewItem,
      message,
      error,
      searching,
      openingTicket,
      addingToTicket,
      targetStatus,
      paginationModel,
      pageCount,
      currentPage,
      categoryNames,
      subcategoryOptions,
      canSearch,
      canGoToTicket,
      canAddToTicket,
    },
    actions: {
      setPage,
      setItemNumber,
      setCategoryName,
      setSubcategory,
      setBrandName,
      setModelNumber,
      setSerialNumber,
      setPreviewItem,
      setPaginationModel,
      handleSearch,
      handleGoToTicket,
      handleAddToTicket,
      handleModeChange,
      handleCheckedItemsChange,
    },
  };
};
