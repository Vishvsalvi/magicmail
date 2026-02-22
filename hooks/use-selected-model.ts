"use client";

import { useState } from "react";

import {
  DEFAULT_MODEL_SELECTION,
  resolveModelSelection,
  type ModelSelection,
} from "@/lib/constants/models";

const SELECTED_MODEL_STORAGE_KEY = "magicmail:selected-model";

function getStoredSelection(): ModelSelection | null {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(SELECTED_MODEL_STORAGE_KEY);
    if (!storedValue) return null;

    const parsed = JSON.parse(storedValue) as {
      providerId?: unknown;
      modelId?: unknown;
    };

    return resolveModelSelection(parsed.providerId, parsed.modelId);
  } catch {
    return null;
  }
}

export function useSelectedModel(initialSelection?: Partial<ModelSelection>) {
  const [selection, setSelectionState] = useState<ModelSelection>(() => {
    if (initialSelection) {
      return resolveModelSelection(initialSelection.providerId, initialSelection.modelId);
    }

    return getStoredSelection() ?? DEFAULT_MODEL_SELECTION;
  });

  const setSelection = (nextSelection: ModelSelection) => {
    const safeSelection = resolveModelSelection(
      nextSelection.providerId,
      nextSelection.modelId
    );
    setSelectionState(safeSelection);

    try {
      window.localStorage.setItem(
        SELECTED_MODEL_STORAGE_KEY,
        JSON.stringify(safeSelection)
      );
    } catch {
      // Ignore localStorage write failures.
    }
  };

  return {
    selection,
    setSelection,
  };
}
