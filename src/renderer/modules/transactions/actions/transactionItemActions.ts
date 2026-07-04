import type { Dispatch, SetStateAction } from "react";
import type { Item } from "../../../../shared/types/Item";
import type { Ticket } from "../../../../shared/types/Ticket";
import { itemService } from "../../items/item.api";
import type { TransactionItemLoadRequest } from "../transaction.types";

type TransactionItemActionDeps = {
  items: Item[];
  selectedTicket: Ticket | null;
  removeItemTarget: Item | null;
  pendingLoadRequest: TransactionItemLoadRequest | null;
  setItems: Dispatch<SetStateAction<Item[]>>;
  setSelectedItem: Dispatch<SetStateAction<Item | null>>;
  setOpenItemDialog: Dispatch<SetStateAction<boolean>>;
  setItemDialogMode: Dispatch<SetStateAction<"add" | "edit">>;
  setRemoveItemTarget: Dispatch<SetStateAction<Item | null>>;
  setPendingLoadRequest: Dispatch<
    SetStateAction<TransactionItemLoadRequest | null>
  >;
  setStatusMessage: Dispatch<SetStateAction<string>>;
};

export const createTransactionItemActions = ({
  items,
  selectedTicket,
  removeItemTarget,
  pendingLoadRequest,
  setItems,
  setSelectedItem,
  setOpenItemDialog,
  setItemDialogMode,
  setRemoveItemTarget,
  setPendingLoadRequest,
  setStatusMessage,
}: TransactionItemActionDeps) => {
  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setStatusMessage("");
  };

  const handleAddItem = () => {
    if (!selectedTicket?.ticket_number) {
      setStatusMessage("Select a ticket first.");
      return;
    }

    setItemDialogMode("add");
    setSelectedItem(null);
    setOpenItemDialog(true);
    setStatusMessage("");
  };

  const handleEditItem = (item: Item) => {
    if (item.is_loaded_draft) {
      setStatusMessage("Loaded draft items must be saved before editing.");
      return;
    }

    setSelectedItem(item);
    setItemDialogMode("edit");
    setOpenItemDialog(true);
    setStatusMessage("");
  };

  const handleRemoveItem = (item: Item) => {
    setRemoveItemTarget(item);
    setStatusMessage("");
  };

  const handleItemSaved = (savedItem: Item) => {
    setItems((prev) => {
      const exists = prev.some(
        (item) => item.item_number === savedItem.item_number,
      );
      return exists
        ? prev.map((item) =>
            item.item_number === savedItem.item_number ? savedItem : item,
          )
        : [savedItem, ...prev];
    });
    setSelectedItem(savedItem);
    setOpenItemDialog(false);
    setStatusMessage(`Item #${savedItem.item_number} saved.`);
  };

  const handleConfirmRemoveItem = async () => {
    if (!removeItemTarget || !selectedTicket?.ticket_number) {
      setRemoveItemTarget(null);
      return;
    }

    await itemService.deleteItem(
      selectedTicket.ticket_number,
      removeItemTarget.item_number,
    );

    const nextItems = items.filter(
      (current) => current.item_number !== removeItemTarget.item_number,
    );

    setItems(nextItems);
    setSelectedItem((prev) => {
      if (
        (prev?.draft_id ?? prev?.item_number) !== removeItemTarget.item_number
      ) {
        return prev ?? null;
      }

      return [...nextItems][0] ?? null;
    });
    setRemoveItemTarget(null);
    setStatusMessage(`Item #${removeItemTarget.item_number} removed.`);
  };

  const handleConfirmLoadedItems = async (
    selectedItems: Item[],
    loadRequest: TransactionItemLoadRequest | null = pendingLoadRequest,
  ) => {
    if (!loadRequest || !selectedItems.length) {
      setPendingLoadRequest((prev) =>
        prev?.requestId === loadRequest?.requestId ? null : prev,
      );
      return;
    }

    try {
      const linkedItems = await itemService.linkItemsToTicket(
        loadRequest.targetTicketNumber,
        selectedItems.map((item) => item.item_number),
      );

      setItems((prev) => {
        const existingItemNumbers = new Set(
          prev.map((item) => item.item_number),
        );
        const newItems = linkedItems.filter(
          (item) => !existingItemNumbers.has(item.item_number),
        );

        return [...newItems, ...prev];
      });
      setSelectedItem((prev) => prev ?? linkedItems[0] ?? null);
      setStatusMessage(
        `${linkedItems.length} item(s) loaded from ticket #${loadRequest.sourceTicketNumber} into ticket #${loadRequest.targetTicketNumber}.`,
      );
    } catch (err) {
      console.error(err);
      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Unable to load the selected item(s).",
      );
    } finally {
      setPendingLoadRequest((prev) =>
        prev?.requestId === loadRequest.requestId ? null : prev,
      );
    }
  };

  return {
    handleItemClick,
    handleAddItem,
    handleEditItem,
    handleRemoveItem,
    handleItemSaved,
    handleConfirmRemoveItem,
    handleConfirmLoadedItems,
  };
};
