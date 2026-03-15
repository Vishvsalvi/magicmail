"use client";

import {
  DEFAULT_MODEL_SELECTION,
  resolveModelSelection,
  type ModelSelection,
} from "@/lib/constants/models";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { usePersistedState } from "@/hooks/use-persisted-state";

function parseStoredModel(raw: string): ModelSelection | null {
  try {
    const parsed = JSON.parse(raw) as { providerId?: unknown; modelId?: unknown };
    return resolveModelSelection(parsed.providerId, parsed.modelId);
  } catch {
    return null;
  }
}

export function useSelectedModel(initialSelection?: Partial<ModelSelection>) {
  const override = initialSelection
    ? resolveModelSelection(initialSelection.providerId, initialSelection.modelId)
    : undefined;

  const [selection, setSelectionState] = usePersistedState(
    STORAGE_KEYS.SELECTED_MODEL,
    parseStoredModel,
    DEFAULT_MODEL_SELECTION,
    { override }
  );

  const setSelection = (nextSelection: ModelSelection) => {
    const safeSelection = resolveModelSelection(
      nextSelection.providerId,
      nextSelection.modelId
    );
    setSelectionState(safeSelection);
  };

  return {
    selection,
    setSelection,
  };
}
