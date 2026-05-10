import { useEffect, useMemo, useState } from "react";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { ItemLoadWindowPayload } from "../../../../shared/types/windowPayload";
import {
  getTransactionItemRowId,
} from "../../../components/transaction/items/TransactionItemsTable";
import { windowService } from "../../../services/windowService";

export const useItemLoadWindowController = () => {
  const requestId = useMemo(() => {
    return new URLSearchParams(window.location.search).get("requestId") ?? "";
  }, []);
  const [payload, setPayload] = useState<ItemLoadWindowPayload | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [previewItemId, setPreviewItemId] = useState<number | string | null>(null);
  const [error, setError] = useState("");
  const previewItem =
    payload?.items.find(
      (item) =>
        String(getTransactionItemRowId(item)) === String(previewItemId),
    ) ?? payload?.items[0];
  const blockedItemCount =
    payload?.items.filter((item) => item.is_loadable === false).length ?? 0;

  useEffect(() => {
    let active = true;

    const loadPayload = async () => {
      if (!requestId) {
        setError("Missing window request.");
        return;
      }

      const nextPayload = await windowService.loadItemLoadWindowPayload(requestId);

      if (!active) {
        return;
      }

      if (!nextPayload) {
        setError("This load window is no longer available.");
        return;
      }

      setPayload(nextPayload);
      setSelectionModel(
        nextPayload.items
          .filter((item) => item.is_loadable !== false)
          .map(getTransactionItemRowId),
      );
      setPreviewItemId(
        nextPayload.items[0] ? getTransactionItemRowId(nextPayload.items[0]) : null,
      );
      document.title = nextPayload.title;
    };

    void loadPayload();

    return () => {
      active = false;
    };
  }, [requestId]);

  const handleSelectionChange = (nextSelectionModel: GridRowSelectionModel) => {
    if (!payload) {
      setSelectionModel([]);
      return;
    }

    const loadableIds = new Set(
      payload.items
        .filter((item) => item.is_loadable !== false)
        .map((item) => String(getTransactionItemRowId(item))),
    );

    setSelectionModel(
      nextSelectionModel.filter((id) => loadableIds.has(String(id))),
    );
  };

  const handleSubmit = async () => {
    if (!requestId) {
      return;
    }

    await windowService.submitItemLoadWindow(requestId, [...selectionModel]);
  };

  const handleCancel = async () => {
    if (!requestId) {
      window.close();
      return;
    }

    await windowService.cancelItemLoadWindow(requestId);
  };

  return {
    state: {
      payload,
      selectionModel,
      previewItem,
      blockedItemCount,
      error,
    },
    actions: {
      setPreviewItemId,
      handleSelectionChange,
      handleSubmit,
      handleCancel,
    },
  };
};
