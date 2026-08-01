import { useEffect, useMemo, useRef, useState } from "react";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { ItemLoadWindowData } from "../../../../shared/payload-contracts/window.contract";
import { getTransactionItemRowId } from "../components/transaction/TransactionItemsTable";
import { getAppApi } from "../../../shared/api/app.api";

export const useItemLoadWindow = () => {
  const requestId = useMemo(() => {
    return new URLSearchParams(window.location.search).get("requestId") ?? "";
  }, []);
  const [payload, setPayload] = useState<ItemLoadWindowData | null>(null);
  const payloadRef = useRef<ItemLoadWindowData | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );
  const [previewItemId, setPreviewItemId] = useState<number | string | null>(
    null,
  );
  const [error, setError] = useState("");
  const previewItem =
    payload?.items.find(
      (item) => String(getTransactionItemRowId(item)) === String(previewItemId),
    ) ?? payload?.items[0];
  const blockedItemCount =
    payload?.items.filter((item) => item.is_loadable === false).length ?? 0;

  useEffect(() => {
    let active = true;

    const loadPayload = async (preserveCurrentSelection = false) => {
      if (!requestId) {
        setError("Missing window request.");
        return;
      }

      let nextPayload: ItemLoadWindowData | null = null;
      try {
        nextPayload =
          (await getAppApi()?.window.loadItemLoadWindowData(requestId)) ?? null;
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Unable to load this window.");
        }
        return;
      }

      if (!active) {
        return;
      }

      if (!nextPayload) {
        setError("This load window is no longer available.");
        return;
      }

      const previousPayload = payloadRef.current;
      const previousItemIds = new Set(
        (previousPayload?.items ?? [])
          .map(getTransactionItemRowId)
          .filter((id): id is number | string => id !== undefined)
          .map(String),
      );
      const loadableIds = nextPayload.items
        .filter((item) => item.is_loadable !== false)
        .map(getTransactionItemRowId)
        .filter((id): id is number | string => id !== undefined);
      const firstNewItemId =
        nextPayload.items
          .map(getTransactionItemRowId)
          .find(
            (id): id is number | string =>
              id !== undefined && !previousItemIds.has(String(id)),
          ) ?? null;
      const firstItemId = nextPayload.items[0]
        ? getTransactionItemRowId(nextPayload.items[0]) ?? null
        : null;

      setError("");
      payloadRef.current = nextPayload;
      setPayload(nextPayload);
      if (preserveCurrentSelection) {
        setSelectionModel((currentSelectionModel) => {
          const selectedIds = new Set(currentSelectionModel.map(String));
          return loadableIds.filter((id) => {
            const idText = String(id);
            return selectedIds.has(idText) || !previousItemIds.has(idText);
          });
        });
      } else {
        setSelectionModel(loadableIds);
      }
      setPreviewItemId((currentPreviewItemId) => {
        const currentPreviewStillExists =
          currentPreviewItemId !== null &&
          nextPayload.items.some(
            (item) =>
              String(getTransactionItemRowId(item)) ===
              String(currentPreviewItemId),
          );

        if (preserveCurrentSelection && currentPreviewStillExists) {
          return currentPreviewItemId;
        }

        return firstNewItemId ?? firstItemId;
      });
      document.title = nextPayload.title;
    };

    void loadPayload();

    const unsubscribe =
      getAppApi()?.window.subscribeToItemLoadWindowDataUpdated(
        (updatedRequestId) => {
          if (updatedRequestId === requestId) {
            void loadPayload(true);
          }
        },
      ) ?? (() => {});

    return () => {
      active = false;
      unsubscribe();
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

    await getAppApi()?.window.submitItemLoadWindow(requestId, [
      ...selectionModel,
    ]);
  };

  const handleCancel = async () => {
    if (!requestId) {
      window.close();
      return;
    }

    await getAppApi()?.window.cancelItemLoadWindow(requestId);
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
