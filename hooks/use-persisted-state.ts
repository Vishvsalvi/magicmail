"use client";

import { useEffect, useState } from "react";

/**
 * Generic hook that persists state to localStorage.
 *
 * @param key - The localStorage key.
 * @param parse - Converts the raw stored string to T. Return null to ignore the stored value.
 * @param defaultValue - Used as the initial value when no stored value exists.
 * @param options.override - If defined, bypasses localStorage entirely and uses this value.
 * @param options.serialize - Converts T back to a string for storage. Defaults to JSON.stringify.
 */
export function usePersistedState<T>(
  key: string,
  parse: (raw: string) => T | null,
  defaultValue: T,
  options?: {
    override?: T;
    serialize?: (value: T) => string;
  }
): [T, (value: T) => void] {
  const { override, serialize = JSON.stringify } = options ?? {};

  const [state, setState] = useState<T>(() => override ?? defaultValue);

  useEffect(() => {
    if (override !== undefined) return;
    if (typeof window === "undefined") return;

    let timeoutId: number | undefined;

    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = parse(raw);
        if (parsed !== null) {
          timeoutId = window.setTimeout(() => setState(parsed), 0);
        }
      }
    } catch {
      // Ignore localStorage read failures.
    }

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
    // parse is intentionally omitted — callers should define it outside the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, override]);

  const setValue = (nextValue: T) => {
    setState(nextValue);
    try {
      window.localStorage.setItem(key, serialize(nextValue));
    } catch {
      // Ignore localStorage write failures.
    }
  };

  return [state, setValue];
}
